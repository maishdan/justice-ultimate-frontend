import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../ui/card';
import { Button, IconButton, DangerButton, PrimaryButton, SecondaryButton } from '../../ui/button';
import { Input, SearchInput } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Dialog, DialogContent, DialogHeader as DHeader, DialogTitle as DTitle, DialogTrigger, DialogOverlay } from '../../ui/dialog';
import { FiMail, FiUser, FiStar, FiTrash, FiArchive, FiCheckCircle, FiEye, FiEyeOff, FiEdit2, FiSend, FiDownload, FiChevronDown, FiChevronUp, FiSearch, FiInbox, FiPaperclip, FiShare2, FiX, FiVolume2, FiCornerUpRight, FiZap, FiRefreshCw } from 'react-icons/fi';
import dayjs from 'dayjs';

const NOTIFY_SOUND = '/public/car-start.mp3';

function playNotifySound() {
  const audio = new Audio(NOTIFY_SOUND);
  audio.play();
}

// Fix PRIORITY_COLORS index type
const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  normal: 'bg-blue-100 text-blue-700',
  low: 'bg-green-100 text-green-700',
};

export default function InboxPanel() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all'|'unread'|'read'|'archived'|'important'>('all');
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bulkSelect, setBulkSelect] = useState<string[]>([]);
  const [sortDesc, setSortDesc] = useState(true);
  const [notify, setNotify] = useState(false);
  const notifyRef = useRef<HTMLAudioElement>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);
  const popupTimeout = useRef<NodeJS.Timeout | null>(null);

  // Play notification sound
  const playNotificationSound = () => {
    const audio = new Audio('/car-start.mp3');
    audio.play();
  };

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (!error) setMessages(data || []);
    setLoading(false);
    setPopup('Inbox refreshed! Showing latest messages.');
    playNotificationSound();
    if (popupTimeout.current) clearTimeout(popupTimeout.current);
    popupTimeout.current = setTimeout(() => setPopup(null), 30000);
  };

  // Fetch messages from Supabase
  useEffect(() => {
    setLoading(true);
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setMessages(data || []);
      setLoading(false);
    });
    // Real-time subscription
    const sub = supabase
      .channel('contact_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, payload => {
        setMessages(prev => [payload.new, ...prev]);
        setNotify(true);
      })
      .subscribe();
    return () => { sub.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (notify) {
      playNotifySound();
      setNotify(false);
    }
  }, [notify]);

  // Search and filter
  const filtered = messages.filter(msg => {
    if (filter === 'unread' && msg.status === 'read') return false;
    if (filter === 'read' && msg.status !== 'read') return false;
    if (filter === 'archived' && msg.status !== 'archived') return false;
    if (filter === 'important' && !msg.important) return false;
    if (search && !(
      msg.name?.toLowerCase().includes(search.toLowerCase()) ||
      msg.email?.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject?.toLowerCase().includes(search.toLowerCase()) ||
      msg.message?.toLowerCase().includes(search.toLowerCase())
    )) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => sortDesc ? (dayjs(b.created_at).unix() - dayjs(a.created_at).unix()) : (dayjs(a.created_at).unix() - dayjs(b.created_at).unix()));

  // Actions
  const markAsRead = async (id: string) => {
    await supabase.from('contact_messages').update({ status: 'read' }).eq('id', id);
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status: 'read' } : m));
  };
  const markAsUnread = async (id: string) => {
    await supabase.from('contact_messages').update({ status: 'unread' }).eq('id', id);
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status: 'unread' } : m));
  };
  const archiveMessage = async (id: string) => {
    await supabase.from('contact_messages').update({ status: 'archived' }).eq('id', id);
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status: 'archived' } : m));
  };
  const deleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages(msgs => msgs.filter(m => m.id !== id));
  };
  const toggleImportant = async (id: string, important: boolean) => {
    await supabase.from('contact_messages').update({ important: !important }).eq('id', id);
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, important: !important } : m));
  };
  const markAllAsRead = async () => {
    const ids = sorted.filter(m => m.status !== 'read').map(m => m.id);
    if (ids.length) {
      await supabase.from('contact_messages').update({ status: 'read' }).in('id', ids);
      setMessages(msgs => msgs.map(m => ids.includes(m.id) ? { ...m, status: 'read' } : m));
    }
  };
  // Reply
  const handleReply = async () => {
    if (!selected) return;
    await supabase.from('contact_messages').update({ admin_reply: reply, status: 'replied' }).eq('id', selected.id);
    setMessages(msgs => msgs.map(m => m.id === selected.id ? { ...m, admin_reply: reply, status: 'replied' } : m));
    setReply('');
    setShowReplyModal(false);
  };
  // Edit
  const handleEdit = async (fields: any) => {
    if (!selected) return;
    await supabase.from('contact_messages').update(fields).eq('id', selected.id);
    setMessages(msgs => msgs.map(m => m.id === selected.id ? { ...m, ...fields } : m));
    setShowEditModal(false);
  };
  // Forward
  const handleForward = (msg: any) => {
    const mailto = `mailto:?subject=FWD: ${msg.subject}&body=From: ${msg.name} <${msg.email}>\n\n${msg.message}`;
    window.open(mailto, '_blank');
  };
  // Download attachment
  const handleDownload = (file_url: string) => {
    if (!file_url) return;
    const url = supabase.storage.from('contact_uploads').getPublicUrl(file_url).data.publicUrl;
    window.open(url, '_blank');
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (!bulkSelect.length) return;
    await supabase.from('contact_messages').delete().in('id', bulkSelect);
    setMessages(msgs => msgs.filter(m => !bulkSelect.includes(m.id)));
    setBulkSelect([]);
  };
  const handleBulkArchive = async () => {
    if (!bulkSelect.length) return;
    await supabase.from('contact_messages').update({ status: 'archived' }).in('id', bulkSelect);
    setMessages(msgs => msgs.map(m => bulkSelect.includes(m.id) ? { ...m, status: 'archived' } : m));
    setBulkSelect([]);
  };

  // AI Reply Suggestions
  const fetchAiSuggestions = async (msg: any) => {
    setAiLoading(true);
    setAiSuggestions([]);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful, professional customer support admin for Justice Ultimate Automobiles. Suggest 3 short, polite, professional replies to the following customer message. Return as a JSON array.' },
            { role: 'user', content: msg.message },
          ],
          max_tokens: 200,
          temperature: 0.6,
        }),
      });
      const data = await response.json();
      // Try to parse JSON array from response
      let suggestions: string[] = [];
      try {
        suggestions = JSON.parse(data.choices?.[0]?.message?.content || '[]');
      } catch {
        // fallback: split by newlines
        suggestions = (data.choices?.[0]?.message?.content || '').split('\n').filter(Boolean);
      }
      setAiSuggestions(suggestions.slice(0, 3));
    } catch (e) {
      setAiSuggestions([]);
    }
    setAiLoading(false);
  };

  // UI
  return (
    <div className="w-full max-w-6xl mx-auto min-h-[70vh] py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <SearchInput placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} />
          <Button variant={filter==='all'?'primary':'outline'} onClick={()=>setFilter('all')}>All</Button>
          <Button variant={filter==='unread'?'primary':'outline'} onClick={()=>setFilter('unread')}>Unread</Button>
          <Button variant={filter==='read'?'primary':'outline'} onClick={()=>setFilter('read')}>Read</Button>
          <Button variant={filter==='archived'?'primary':'outline'} onClick={()=>setFilter('archived')}>Archived</Button>
          <Button variant={filter==='important'?'primary':'outline'} onClick={()=>setFilter('important')}>Important</Button>
          <Button onClick={fetchMessages} variant="outline"><FiRefreshCw className="inline mr-1"/>Refresh</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={markAllAsRead} variant="secondary"><FiCheckCircle className="inline mr-1"/>Mark All as Read</Button>
          <Button onClick={handleBulkArchive} variant="outline" disabled={!bulkSelect.length}><FiArchive className="inline mr-1"/>Archive Selected</Button>
          <DangerButton onClick={handleBulkDelete} disabled={!bulkSelect.length}><FiTrash className="inline mr-1"/>Delete Selected</DangerButton>
          <Button onClick={()=>setSortDesc(s=>!s)} variant="outline"><FiChevronDown className={sortDesc?"inline":"hidden"}/><FiChevronUp className={!sortDesc?"inline":"hidden"}/>Sort</Button>
        </div>
      </div>
      {/* Add popup notification UI */}
      {popup && (
        <div className="fixed top-6 right-6 z-50 bg-white dark:bg-gray-900 border border-yellow-400 shadow-xl rounded-xl p-4 flex items-center gap-4 animate-fade-in-out" style={{ animationDuration: '30s' }}>
          <FiInbox className="text-yellow-400 text-2xl" />
          <div>
            <div className="font-bold text-lg">Inbox Refreshed</div>
            <div className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2">{popup}</div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? <div className="col-span-full text-center py-12 text-lg">Loading messages...</div> : null}
        {!loading && sorted.length === 0 ? <div className="col-span-full text-center py-12 text-lg">No messages found.</div> : null}
        {sorted.map(msg => (
          <Card key={msg.id} className={`relative shadow-lg border-2 ${msg.status==='unread'?'border-yellow-400':'border-gray-200 dark:border-gray-700'} ${bulkSelect.includes(msg.id)?'ring-2 ring-blue-400':''} transition-all`}> 
            <div className="absolute top-2 right-2 flex gap-1">
              <input type="checkbox" checked={bulkSelect.includes(msg.id)} onChange={e=>setBulkSelect(sel=>e.target.checked?[...sel,msg.id]:sel.filter(i=>i!==msg.id))} />
              <IconButton icon={FiStar} onClick={()=>toggleImportant(msg.id, msg.important)} className={msg.important?'text-yellow-400':'text-gray-400'} />
              <IconButton icon={FiArchive} onClick={()=>archiveMessage(msg.id)} />
              <IconButton icon={FiTrash} onClick={()=>deleteMessage(msg.id)} />
            </div>
            <CardHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FiUser className="text-blue-500"/>
                <span className="font-bold text-lg">{msg.name}</span>
                <span className="text-xs text-gray-400">{msg.email}</span>
                {msg.status==='unread' && <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs">Unread</span>}
                {msg.important && <span className="ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs">Important</span>}
                {msg.status==='archived' && <span className="ml-2 px-2 py-1 bg-gray-300 text-gray-700 rounded-full text-xs">Archived</span>}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{dayjs(msg.created_at).format('MMM D, YYYY HH:mm')}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${PRIORITY_COLORS[msg.priority||'normal']}`}>{msg.priority||'Normal'}</span>
                <span className="ml-2">{msg.type}</span>
              </div>
              <div className="font-semibold text-blue-700 dark:text-blue-200 text-base mt-1">{msg.subject}</div>
            </CardHeader>
            <CardContent className="line-clamp-3 text-gray-700 dark:text-gray-200 mb-2">{msg.message}</CardContent>
            <CardFooter className="flex gap-2 flex-wrap">
              <Button onClick={()=>{setSelected(msg);setShowModal(true);if(msg.status!=='read')markAsRead(msg.id);}} variant="primary"><FiEye className="inline mr-1"/>View</Button>
              <Button onClick={()=>{setSelected(msg);setShowReplyModal(true);}} variant="secondary"><FiCornerUpRight className="inline mr-1"/>Reply</Button>
              <Button onClick={()=>handleForward(msg)} variant="outline"><FiShare2 className="inline mr-1"/>Forward</Button>
              {msg.file_url && <Button onClick={()=>handleDownload(msg.file_url)} variant="outline"><FiDownload className="inline mr-1"/>Attachment</Button>}
              {msg.status==='read' ? <Button onClick={()=>markAsUnread(msg.id)} variant="outline"><FiEyeOff className="inline mr-1"/>Mark Unread</Button> : <Button onClick={()=>markAsRead(msg.id)} variant="outline"><FiEye className="inline mr-1"/>Mark Read</Button>}
              <Button onClick={()=>{setSelected(msg);setShowEditModal(true);}} variant="outline"><FiEdit2 className="inline mr-1"/>Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* View Message Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DHeader><DTitle>Message Details</DTitle></DHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="font-bold text-lg">{selected.name}</span>
                <span className="text-xs text-gray-400">{selected.email}</span>
                <span className="text-xs text-gray-400">{selected.phone}</span>
                <span className="text-xs text-gray-400">{selected.type}</span>
                <span className="text-xs text-gray-400">{dayjs(selected.created_at).format('MMM D, YYYY HH:mm')}</span>
              </div>
              <div className="font-semibold text-blue-700 dark:text-blue-200 text-base">{selected.subject}</div>
              <div className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{selected.message}</div>
              {selected.file_url && <Button onClick={()=>handleDownload(selected.file_url)} variant="outline"><FiDownload className="inline mr-1"/>Download Attachment</Button>}
              {selected.admin_reply && <div className="bg-green-100 text-green-800 rounded p-3 mt-2"><b>Admin Reply:</b><br/>{selected.admin_reply}</div>}
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <Button onClick={()=>{setShowReplyModal(true);setShowModal(false);}} variant="secondary"><FiCornerUpRight className="inline mr-1"/>Reply</Button>
            <Button onClick={()=>handleForward(selected)} variant="outline"><FiShare2 className="inline mr-1"/>Forward</Button>
            <Button onClick={()=>{setShowEditModal(true);setShowModal(false);}} variant="outline"><FiEdit2 className="inline mr-1"/>Edit</Button>
            <DangerButton onClick={()=>{deleteMessage(selected.id);setShowModal(false);}}>Delete</DangerButton>
          </div>
        </DialogContent>
      </Dialog>
      {/* Reply Modal */}
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <DialogContent className="max-w-lg">
          <DHeader><DTitle>Reply to {selected?.name}</DTitle></DHeader>
          <Textarea placeholder="Type your reply..." value={reply} onChange={e=>setReply(e.target.value)} rows={6} />
          <div className="flex gap-2 mt-2 items-center">
            {/* @ts-expect-error: Button typing issue for 'disabled' prop */}
            <Button onClick={()=>fetchAiSuggestions(selected)} variant="outline" disabled={aiLoading}>
              <FiZap className="inline mr-1"/>AI Suggestions
            </Button>
            {aiLoading && <span className="text-xs text-blue-500 animate-pulse ml-2">Loading suggestions...</span>}
          </div>
          {aiSuggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              {aiSuggestions.map((s: string, i: number) => (
                <button key={i} className="w-full text-left bg-blue-50 dark:bg-blue-900/40 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded p-2 border border-blue-200 dark:border-blue-700 text-sm transition" onClick={()=>setReply(s)}>
                  <FiZap className="inline mr-1 text-yellow-400"/> {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <PrimaryButton onClick={handleReply}><FiSend className="inline mr-1"/>Send Reply</PrimaryButton>
            <SecondaryButton onClick={()=>setShowReplyModal(false)}>Cancel</SecondaryButton>
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DHeader><DTitle>Edit Message</DTitle></DHeader>
          <div className="space-y-2">
            <Input placeholder="Subject" value={selected?.subject||''} onChange={e=>setSelected(s=>({...s,subject:e.target.value}))} />
            <Textarea placeholder="Message" value={selected?.message||''} onChange={e=>setSelected(s=>({...s,message:e.target.value}))} rows={6} />
            <Input placeholder="Priority (high, normal, low)" value={selected?.priority||''} onChange={e=>setSelected(s=>({...s,priority:e.target.value}))} />
          </div>
          <div className="flex gap-2 mt-4">
            <PrimaryButton onClick={()=>handleEdit({subject:selected.subject,message:selected.message,priority:selected.priority})}><FiEdit2 className="inline mr-1"/>Save</PrimaryButton>
            <SecondaryButton onClick={()=>setShowEditModal(false)}>Cancel</SecondaryButton>
          </div>
        </DialogContent>
      </Dialog>
      {/* Notification Sound */}
      <audio ref={notifyRef} src={NOTIFY_SOUND} className="hidden" preload="auto" />
    </div>
  );
} 