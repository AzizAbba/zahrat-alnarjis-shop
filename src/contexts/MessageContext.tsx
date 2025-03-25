
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContactMessage } from '@/types/message';
import { toast } from '@/components/ui/use-toast';

// Initial sample messages
const sampleMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966 55 123 4567',
    subject: 'استفسار عن المنتجات',
    message: 'مرحباً، أود الاستفسار عن توفر المنتجات وأوقات التوصيل. شكراً لكم.',
    date: '2023-08-15T10:30:00',
    status: 'unread',
    starred: false
  },
  {
    id: '2',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    phone: '+966 50 987 6543',
    subject: 'مشكلة في الطلب #12345',
    message: 'مرحباً، أواجه مشكلة في طلبي رقم 12345، حيث لم يصلني المنتج بعد رغم مرور أسبوع على الطلب. أرجو المساعدة.',
    date: '2023-08-14T16:45:00',
    status: 'read',
    starred: true
  },
  {
    id: '3',
    name: 'محمد علي',
    email: 'mohamed@example.com',
    phone: '+966 56 555 7777',
    subject: 'طلب تعاون تجاري',
    message: 'مرحباً، أود التواصل بخصوص إمكانية التعاون التجاري وعرض منتجاتكم في متجرنا. أرجو التواصل على الرقم الموضح.',
    date: '2023-08-13T09:15:00',
    status: 'replied',
    starred: false,
    reply: 'شكراً لتواصلكم معنا. سنتصل بكم قريباً لمناقشة التفاصيل.'
  }
];

interface MessageContextType {
  messages: ContactMessage[];
  addMessage: (message: Omit<ContactMessage, 'id' | 'date' | 'status' | 'starred'>) => void;
  updateMessage: (id: string, updates: Partial<ContactMessage>) => void;
  deleteMessage: (id: string) => void;
  markAsRead: (id: string) => void;
  markAsReplied: (id: string, reply: string) => void;
  toggleStar: (id: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  useEffect(() => {
    // Load messages from localStorage or use sample data
    const storedMessages = localStorage.getItem('contactMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages(sampleMessages);
      localStorage.setItem('contactMessages', JSON.stringify(sampleMessages));
    }
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('contactMessages', JSON.stringify(messages));
  }, [messages]);
  
  const addMessage = (message: Omit<ContactMessage, 'id' | 'date' | 'status' | 'starred'>) => {
    const newMessage: ContactMessage = {
      ...message,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'unread',
      starred: false
    };
    
    setMessages(prev => [newMessage, ...prev]);
    toast({
      title: "تم إرسال الرسالة",
      description: "سنقوم بالرد عليك في أقرب وقت ممكن",
    });
  };
  
  const updateMessage = (id: string, updates: Partial<ContactMessage>) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === id ? { ...message, ...updates } : message
      )
    );
  };
  
  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };
  
  const markAsRead = (id: string) => {
    updateMessage(id, { status: 'read' });
  };
  
  const markAsReplied = (id: string, reply: string) => {
    updateMessage(id, { status: 'replied', reply });
  };
  
  const toggleStar = (id: string) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === id ? { ...message, starred: !message.starred } : message
      )
    );
  };
  
  return (
    <MessageContext.Provider value={{
      messages,
      addMessage,
      updateMessage,
      deleteMessage,
      markAsRead,
      markAsReplied,
      toggleStar
    }}>
      {children}
    </MessageContext.Provider>
  );
};
