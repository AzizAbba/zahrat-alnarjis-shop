
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Mail, 
  Clock, 
  Star, 
  Trash2, 
  MessageSquare, 
  CircleCheck, 
  Loader2
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useMessages } from '@/contexts/MessageContext';
import { ContactMessage } from '@/types/message';

const MessagesPage = () => {
  const { messages, updateMessage, deleteMessage, markAsRead, markAsReplied, toggleStar } = useMessages();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // Filter messages based on search term and status
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && message.status === statusFilter;
  });
  
  const handleDeleteConfirm = () => {
    if (messageToDelete) {
      deleteMessage(messageToDelete);
      if (selectedMessage && selectedMessage.id === messageToDelete) {
        setSelectedMessage(null);
      }
      setMessageToDelete(null);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "تم الحذف",
        description: "تم حذف الرسالة بنجاح",
      });
    }
  };
  
  const handleReply = () => {
    if (!selectedMessage || !replyText.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة الرد",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      markAsReplied(selectedMessage.id, replyText);
      setIsLoading(false);
      setReplyText('');
      
      toast({
        title: "تم الإرسال",
        description: "تم إرسال الرد بنجاح",
      });
    }, 1500);
  };
  
  // Format date to readable string
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
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold arabic">الرسائل والاستفسارات</h1>
        
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في الرسائل..."
              className="pl-8 rtl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="جميع الرسائل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="arabic">جميع الرسائل</SelectItem>
              <SelectItem value="unread" className="arabic">غير مقروءة</SelectItem>
              <SelectItem value="read" className="arabic">مقروءة</SelectItem>
              <SelectItem value="replied" className="arabic">تم الرد</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-1 border rounded-lg bg-white overflow-hidden">
          <div className="p-3 bg-narcissus-50 border-b">
            <h2 className="font-semibold arabic">قائمة الرسائل ({filteredMessages.length})</h2>
          </div>
          
          <div className="divide-y overflow-auto max-h-[70vh]">
            {filteredMessages.length > 0 ? (
              filteredMessages.map(message => (
                <div 
                  key={message.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id 
                      ? 'bg-narcissus-50' 
                      : message.status === 'unread'
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === 'unread') {
                      markAsRead(message.id);
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-medium arabic text-sm ${
                      message.status === 'unread' ? 'text-black' : 'text-gray-700'
                    }`}>
                      {message.name}
                    </h3>
                    <div className="flex items-center">
                      {message.status === 'unread' && (
                        <div className="w-2 h-2 rounded-full bg-narcissus-600 mr-1"></div>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(message.id);
                        }}
                        className="text-gray-400 hover:text-yellow-400"
                      >
                        <Star 
                          className={`h-4 w-4 ${message.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                        />
                      </button>
                    </div>
                  </div>
                  
                  <p className={`text-sm truncate ${
                    message.status === 'unread' ? 'font-medium' : 'text-gray-500'
                  }`}>
                    {message.subject}
                  </p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(message.date)}
                    </span>
                    
                    {message.status === 'replied' && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        <CircleCheck className="h-3 w-3 mr-1" />
                        تم الرد
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="arabic">لا توجد رسائل متطابقة</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Message Detail */}
        <div className="md:col-span-2">
          {selectedMessage ? (
            <div className="border rounded-lg bg-white overflow-hidden">
              <div className="p-4 bg-narcissus-50 border-b flex justify-between items-center">
                <h2 className="font-semibold arabic">{selectedMessage.subject}</h2>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      toggleStar(selectedMessage.id);
                    }}
                    className="text-gray-400 hover:text-yellow-400"
                  >
                    <Star 
                      className={`h-4 w-4 ${selectedMessage.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setMessageToDelete(selectedMessage.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-y-2 mb-6">
                  <div className="w-full sm:w-1/2">
                    <span className="text-gray-500 arabic">من:</span>
                    <span className="font-medium mr-2">{selectedMessage.name}</span>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <span className="text-gray-500 arabic">البريد الإلكتروني:</span>
                    <span className="font-medium mr-2">{selectedMessage.email}</span>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <span className="text-gray-500 arabic">رقم الهاتف:</span>
                    <span className="font-medium mr-2">{selectedMessage.phone}</span>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <span className="text-gray-500 arabic">التاريخ:</span>
                    <span className="font-medium mr-2">{formatDate(selectedMessage.date)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2 arabic">نص الرسالة:</h3>
                  <div className="p-4 bg-gray-50 rounded-lg border text-gray-700">
                    {selectedMessage.message}
                  </div>
                </div>
                
                {selectedMessage.reply && (
                  <>
                    <Separator className="my-4" />
                    <div className="mb-6">
                      <h3 className="font-medium mb-2 arabic">الرد السابق:</h3>
                      <div className="p-4 bg-narcissus-50 rounded-lg border border-narcissus-200 text-gray-700">
                        {selectedMessage.reply}
                      </div>
                    </div>
                  </>
                )}
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="font-medium mb-2 arabic">الرد:</h3>
                  <textarea
                    className="w-full p-3 border rounded-lg min-h-[120px] focus:outline-none focus:ring-1 focus:ring-narcissus-500"
                    placeholder="اكتب ردك هنا..."
                    dir="rtl"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => setSelectedMessage(null)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      disabled={isLoading || !replyText.trim()}
                      onClick={handleReply}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          إرسال الرد
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg bg-white p-10 text-center">
              <Mail className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2 arabic">لم يتم تحديد أي رسالة</h3>
              <p className="text-gray-500 arabic">
                يرجى اختيار رسالة من القائمة لعرض محتواها
              </p>
            </div>
          )}
        </div>
      </div>
      
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
              className="bg-destructive text-destructive-foreground arabic"
              onClick={handleDeleteConfirm}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default MessagesPage;
