
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Eye, Search, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useOrders } from '@/contexts/OrderContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const AdminOrdersPage = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleOpenDialog = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };
  
  const handleStatusChange = (status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, status);
      toast.success(`تم تحديث حالة الطلب إلى "${status === 'completed' ? 'مكتمل' : status === 'cancelled' ? 'ملغي' : 'قيد الانتظار'}"`);
    }
  };
  
  // Filter orders based on status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = 
      searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesStatus && matchesSearch;
  });
  
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة الطلبات</h1>
        
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن طلب..."
              className="pl-8 rtl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="arabic">جميع الطلبات</SelectItem>
              <SelectItem value="pending" className="arabic">قيد الانتظار</SelectItem>
              <SelectItem value="completed" className="arabic">مكتملة</SelectItem>
              <SelectItem value="cancelled" className="arabic">ملغية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-right">
                <th className="p-3 font-medium arabic">رقم الطلب</th>
                <th className="p-3 font-medium arabic">العميل</th>
                <th className="p-3 font-medium arabic">رقم الهاتف</th>
                <th className="p-3 font-medium arabic">التاريخ</th>
                <th className="p-3 font-medium arabic">المبلغ</th>
                <th className="p-3 font-medium arabic">الحالة</th>
                <th className="p-3 font-medium arabic">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b text-right">
                  <td className="p-3 text-sm ltr">{order.id.slice(-8)}</td>
                  <td className="p-3 text-sm arabic">{order.customerInfo.name}</td>
                  <td className="p-3 text-sm ltr">{order.customerInfo.phone}</td>
                  <td className="p-3 text-sm">
                    {new Date(order.date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="p-3 text-sm">{order.totalPrice.toFixed(2)} ريال</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    } arabic`}>
                      {order.status === 'pending' ? 'قيد الانتظار' : 
                       order.status === 'completed' ? 'مكتمل' : 'ملغي'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenDialog(order)}
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground arabic">
                    لا توجد طلبات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="arabic">
                تفاصيل الطلب #{selectedOrder.id.slice(-8)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Order Status */}
              <div className="flex flex-wrap gap-2 justify-end">
                <Button 
                  size="sm" 
                  variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                  className="flex items-center gap-1"
                  onClick={() => handleStatusChange('pending')}
                >
                  <span className="arabic">قيد الانتظار</span>
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedOrder.status === 'completed' ? 'default' : 'outline'} 
                  className="flex items-center gap-1"
                  onClick={() => handleStatusChange('completed')}
                >
                  <Check size={14} />
                  <span className="arabic">مكتمل</span>
                </Button>
                <Button 
                  size="sm" 
                  variant={selectedOrder.status === 'cancelled' ? 'default' : 'outline'}
                  className="flex items-center gap-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => handleStatusChange('cancelled')}
                >
                  <X size={14} />
                  <span className="arabic">ملغي</span>
                </Button>
              </div>
              
              {/* Customer Info */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2 arabic">معلومات العميل</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground arabic">الاسم:</span>
                      <span className="font-medium arabic">{selectedOrder.customerInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground arabic">رقم الهاتف:</span>
                      <span className="font-medium ltr">{selectedOrder.customerInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground arabic">العنوان:</span>
                      <span className="font-medium text-right arabic w-2/3">{selectedOrder.customerInfo.address}</span>
                    </div>
                    {selectedOrder.customerInfo.notes && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground arabic">ملاحظات:</span>
                        <span className="font-medium text-right arabic w-2/3">{selectedOrder.customerInfo.notes}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Order Items */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2 arabic">المنتجات</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded overflow-hidden bg-muted flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="h-full w-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <span className="arabic">{item.name} × {item.quantity}</span>
                        </div>
                        <span>{(item.price * item.quantity).toFixed(2)} ريال</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-bold">
                    <span className="arabic">المجموع</span>
                    <span>{selectedOrder.totalPrice.toFixed(2)} ريال</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleCloseDialog}
                className="arabic"
              >
                إغلاق
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminOrdersPage;
