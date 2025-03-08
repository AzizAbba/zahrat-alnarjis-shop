
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useProducts } from '@/contexts/ProductContext';
import { useOrders } from '@/contexts/OrderContext';

const AdminDashboardPage = () => {
  const { products } = useProducts();
  const { orders } = useOrders();
  
  // Calculate stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders.reduce((total, order) => total + order.totalPrice, 0);
  
  // Generate chart data for orders by day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('ar-SA', { weekday: 'short' }),
      orders: orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.toDateString() === date.toDateString();
      }).length
    };
  });
  
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 arabic">لوحة التحكم</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground arabic">
              إجمالي المنتجات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground arabic">
              إجمالي الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground arabic">
              الطلبات قيد الانتظار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground arabic">
              إجمالي المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRevenue.toFixed(2)} ريال</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="arabic">الطلبات (آخر 7 أيام)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#0094e0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Orders List */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="arabic">أحدث الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-right">
                    <th className="p-2 font-medium arabic">رقم الطلب</th>
                    <th className="p-2 font-medium arabic">العميل</th>
                    <th className="p-2 font-medium arabic">التاريخ</th>
                    <th className="p-2 font-medium arabic">المبلغ</th>
                    <th className="p-2 font-medium arabic">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-t text-right">
                      <td className="p-2 text-sm ltr">{order.id.slice(-8)}</td>
                      <td className="p-2 text-sm arabic">{order.customerInfo.name}</td>
                      <td className="p-2 text-sm">
                        {new Date(order.date).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="p-2 text-sm">{order.totalPrice.toFixed(2)} ريال</td>
                      <td className="p-2 text-sm">
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
                    </tr>
                  ))}
                  
                  {orders.length === 0 && (
                    <tr className="border-t">
                      <td colSpan={5} className="p-4 text-center text-muted-foreground arabic">
                        لا توجد طلبات
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
