# Coffee Bean Ordering System

Next.js + Tailwind CSS + Supabase 線上咖啡豆訂購系統。

本專案包含客戶端商品列表、下單表單、訂單完成頁，以及管理端訂單後台。不包含登入與付款功能。

## Routes

- `/`：客戶端商品列表
- `/order`：客戶下單頁，只保留姓名、Email、備註
- `/order/success`：訂單完成頁
- `/admin/orders`：管理端訂單列表
- `/admin/orders/[id]`：管理端訂單明細

## Structure

- `app/`：Next.js App Router 頁面與 server actions
- `components/`：商品、下單、管理端元件
- `lib/`：Supabase client、商品查詢、共用型別
- `supabase/schema.sql`：資料表、enum、index、RLS

## Setup

1. Install dependencies.
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill Supabase keys.
   ```bash
   cp .env.example .env.local
   ```
3. Run `supabase/schema.sql` in Supabase SQL editor.
4. Start the app.
   ```bash
   npm run dev
   ```
