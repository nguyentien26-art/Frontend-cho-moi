
const mockCategories = [
  { id: 1, name: 'Bất động sản', icon: '🏠' },
  { id: 2, name: 'Xe cộ', icon: '🚗' },
  { id: 3, name: 'Đồ điện tử', icon: '💻' },
  { id: 4, name: 'Thú cưng', icon: '🐶' },
  { id: 5, name: 'Việc làm', icon: '💼' },
  { id: 6, name: 'Đồ gia dụng', icon: '🛋️' },
];

export default function Categories() {
  return (
    <section className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Khám phá danh mục</h2>
      <div className="flex justify-between md:justify-start md:gap-8 overflow-x-auto pb-2">
        {mockCategories.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center min-w-[80px] cursor-pointer hover:opacity-70 transition">
            <div className="bg-gray-100 rounded-full p-4 text-2xl mb-2">
              {cat.icon}
            </div>
            <span className="text-xs text-gray-700 text-center">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}