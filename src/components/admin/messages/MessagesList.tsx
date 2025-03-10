
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, Mail, Phone, X, Reply, Calendar, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface MessagesListProps {
  messages: Message[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (email: string, subject: string, message: string) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  onMarkAsRead,
  onDelete,
  onReply
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // Filter messages based on search term and read/unread filter
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'read') return matchesSearch && message.isRead;
    if (filter === 'unread') return matchesSearch && !message.isRead;
    return matchesSearch;
  });

  const handleOpenReplyDialog = (message: Message) => {
    setSelectedMessage(message);
    setReplyMessage('');
    setIsReplyDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyMessage.trim()) {
      toast.error('الرجاء كتابة رسالة الرد');
      return;
    }

    try {
      onReply(
        selectedMessage.email,
        `رد: ${selectedMessage.subject}`,
        replyMessage
      );
      setIsReplyDialogOpen(false);
      toast.success('تم إرسال الرد بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء إرسال الرد');
    }
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      onDelete(selectedMessage.id);
      setIsDeleteDialogOpen(false);
      toast.success('تم حذف الرسالة بنجاح');
    }
  };

  const handleOpenDeleteDialog = (message: Message) => {
    setSelectedMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في الرسائل..."
            className="pl-8 rtl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="flex-1"
          >
            <span className="arabic">الكل</span>
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            className="flex-1"
          >
            <span className="arabic">غير مقروء</span>
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            onClick={() => setFilter('read')}
            className="flex-1"
          >
            <span className="arabic">مقروء</span>
          </Button>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="text-xl font-medium arabic">لا توجد رسائل</p>
          <p className="text-muted-foreground arabic mt-1">
            {searchTerm 
              ? 'لا توجد رسائل تطابق معايير البحث'
              : filter !== 'all' 
                ? `لا توجد رسائل ${filter === 'read' ? 'مقروءة' : 'غير مقروءة'}`
                : 'لم يتم استلام أي رسائل بعد'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`border ${
                !message.isRead ? 'border-narcissus-400 bg-narcissus-50/50' : 'border-border'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 rounded-full bg-narcissus-100 items-center justify-center">
                        <User className="h-5 w-5 text-narcissus-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{message.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 mr-1" />
                          <span>{message.email}</span>
                        </div>
                        {message.phone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 mr-1" />
                            <span>{message.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1 arabic text-narcissus-800">
                        {message.subject}
                      </h4>
                      <p className="text-muted-foreground arabic whitespace-pre-line">
                        {message.message}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col items-center md:items-end justify-between">
                    <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span className="arabic">{formatDate(message.createdAt)}</span>
                    </div>
                    
                    <div className="flex gap-1 mt-2">
                      {!message.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkAsRead(message.id)}
                          className="text-xs"
                        >
                          <span className="arabic">تعيين كمقروء</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenReplyDialog(message)}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDeleteDialog(message)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              الرد على {selectedMessage?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium arabic">
                البريد الإلكتروني: {selectedMessage?.email}
              </p>
              <p className="text-sm font-medium arabic mt-1">
                الموضوع: {selectedMessage?.subject}
              </p>
            </div>
            
            <Textarea
              placeholder="اكتب رسالتك هنا..."
              dir="rtl"
              rows={6}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="mb-2"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReplyDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleSendReply}>
              إرسال الرد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">حذف الرسالة</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMessage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <span className="arabic">حذف</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MessagesList;
