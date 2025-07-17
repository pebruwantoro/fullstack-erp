import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/user/login.jsx'
import { Layout, SideBarLayout } from './components/layout.jsx'
import Register from './components/user/register.jsx';
import ProductListPage from './components/product/listPage.jsx';
import FormCreateQuotation from './components/quotation/create.jsx'
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/dashboard" element={<SideBarLayout><ProductListPage/></SideBarLayout>}/>
          <Route path="/sales-orders" element={<SideBarLayout></SideBarLayout>}/>
          <Route path="/quotations" element={<SideBarLayout><FormCreateQuotation/></SideBarLayout>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)