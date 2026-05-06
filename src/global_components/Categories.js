
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:1337/api/categories?populate=icon', {
        cache: 'no-store'
      });
      
      if (!res.ok) {
        setCategories([]);
        return;
      }
      
      const json = await res.json();
      setCategories(json.data || []);
    } catch (error) {
      console.error("Lỗi fetch categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-800">Khám phá danh mục</h2>
        <div className="text-center text-gray-400">Đang tải...</div>
      </section>
    );
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <section>
      <h2 className="text-lg font-bold mb-4 text-gray-800">Khám phá danh mục</h2>
      <div className="flex justify-between md:justify-start md:gap-8 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const catName = cat.attributes?.name || cat.name;
          const slug = cat.attributes?.slug || generateSlug(catName);
          const iconUrl = cat.attributes?.icon?.url || cat.icon?.url;
          return (
            <Link key={cat.id} href={`/${slug}`}>
              <div className="flex flex-col items-center min-w-[100px] cursor-pointer hover:opacity-70 transition">
                <div className="bg-white rounded-full p-4 text-2xl mb-2 w-28 h-28 flex items-center justify-center overflow-hidden">
                  {iconUrl ? (
                    <img src={`http://localhost:1337${iconUrl}`} alt={catName} className="w-full h-full object-contain" />
                  ) : (
                    '📦'
                  )}
                </div>
                <span className="text-xs text-gray-700 text-center">
                  {catName}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}