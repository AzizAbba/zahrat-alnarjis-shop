
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-8 text-center arabic">من نحن</h1>
        
        <div className="bg-card rounded-lg border p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4 arabic">منظفات زهر النرجس</h2>
          
          <div className="space-y-4 text-right arabic">
            <p>
              تأسست شركة منظفات زهر النرجس في عام 2010 على يد فريق من الخبراء المتخصصين في مجال المنظفات ومواد التنظيف. انطلقنا بهدف تقديم منتجات تنظيف عالية الجودة وفعالة بأسعار معقولة للأسر والشركات على حد سواء.
            </p>
            
            <p>
              نحن نؤمن بأن النظافة هي أساس الحياة الصحية، ولذلك نسعى جاهدين لتطوير منتجات آمنة وفعالة تساعد عملاءنا على الحفاظ على بيئة نظيفة وصحية.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">رؤيتنا</h3>
            <p>
              أن نكون الشركة الرائدة في مجال منتجات التنظيف في المنطقة، مع الالتزام بتقديم منتجات صديقة للبيئة وفعالة تلبي احتياجات عملائنا وتتجاوز توقعاتهم.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">مهمتنا</h3>
            <p>
              توفير منتجات تنظيف عالية الجودة وآمنة للاستخدام بأسعار تنافسية، مع التركيز على خدمة العملاء وتلبية احتياجاتهم بشكل مستمر.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">قيمنا</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>الجودة - نقدم منتجات فعالة وموثوقة</li>
              <li>الابتكار - نسعى دائماً لتطوير منتجاتنا</li>
              <li>الاستدامة - نهتم بتأثير منتجاتنا على البيئة</li>
              <li>الثقة - نبني علاقات قوية مع العملاء والموردين</li>
              <li>التميز - نسعى للتفوق في كل ما نقوم به</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 arabic">منتجاتنا</h2>
          
          <div className="text-right arabic space-y-4">
            <p>
              تتميز منتجات زهر النرجس بتنوعها الكبير لتلبية كافة احتياجات التنظيف، سواء للمنازل أو المكاتب أو الشركات:
            </p>
            
            <ul className="list-disc list-inside space-y-2">
              <li>منظفات الأرضيات بمختلف أنواعها</li>
              <li>منظفات الزجاج والأسطح</li>
              <li>منظفات الحمامات والمطابخ</li>
              <li>المطهرات ومعقمات اليدين</li>
              <li>معطرات الجو والمفروشات</li>
              <li>منظفات الملابس والأقمشة</li>
              <li>منتجات خاصة لإزالة البقع الصعبة</li>
            </ul>
            
            <p className="mt-4">
              نحرص دائماً على اختيار المكونات عالية الجودة في منتجاتنا، ونجري اختبارات صارمة للتأكد من فعاليتها وسلامتها قبل طرحها في الأسواق.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
