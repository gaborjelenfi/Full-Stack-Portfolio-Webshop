import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import AccountInformation from './pages/AccountInformation';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Content404 from './pages/Content404';
import FooterContent from './components/FooterContent';
import ForgotPassword from './pages/ForgotPassword';
import HeaderContent from './components/HeaderContent';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RouteDenied } from './components/ProtectedRoute';
import { RouteForAdmin } from './components/ProtectedRoute';
import Login from './pages/LogIn';
import ProductDetail from './pages/ProductDetail';
import ProductsList from './pages/ProductsList';
import Navigation from './components/Navigation/Navigation';
import EditAccount from './components/AccountInfo/EditAccount';
import AddressBook from './components/AccountInfo/AddressBook';
import Dashboard from './components/AccountInfo/Dashboard';
import CreateAccount from './pages/CreateAccount';
import Success from './pages/Success';
import Failed from './pages/Failed';
import UpdateAddress from './components/AccountInfo/UpdateAddress';
import AdminPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminHeader from './components/admin/Header';
import AdminAddNewProduct from './pages/admin/AddNewProduct';
import AdminManufacturers from './pages/admin/Manufacturers';
import AdminFooter from './components/admin/Footer';
import AdminCustomerFind from './pages/admin/CustomerFind';
import AdminOrderFind from './pages/admin/OrderFind';
import AdminAdmins from './pages/admin/Admins';

const CustomerLayout = () => {
  return (
    <>
      <HeaderContent />
      <Navigation />
      <Outlet />
      <FooterContent />
    </>
  );
};

const AdminLayout = () => {
  return (
    <>
      <AdminHeader />
      <Outlet />
      <AdminFooter />
    </>
  );
};

function App() {

  return (
    <div>
      <div className="inner-page">
        <div id="page">
          <Routes>
            <Route path="/" element={<Navigate to="products-list" replace />} />
            <Route path="/" element={<CustomerLayout />}>
              <Route path="products-list" element={<ProductsList />} />
              <Route path="product-detail" element={<ProductDetail />}/>
              <Route
                path="account-information/*"
                element={
                  <ProtectedRoute>
                    <AccountInformation />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="edit-account"
                  element={
                    <ProtectedRoute>
                      <EditAccount />
                    </ProtectedRoute>
                  }
                />
                <Route path="address-book" element={<AddressBook />}>
                  <Route path="update-address" element={<UpdateAddress />} />
                </Route>
                <Route path="account-dashboard" element={<Dashboard />} />
              </Route>
              <Route path="create-account" element={<CreateAccount />} />
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="404" element={<Content404 />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route
                path="success"
                element={
                  <RouteDenied>
                    <Success />
                  </RouteDenied>
                }
              />
              <Route
                path="failed"
                element={
                  <RouteDenied>
                    <Failed />
                  </RouteDenied>
                }
              />
              <Route path="*" element={<Content404 to="404" />} />
            </Route>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminPage />} />
              <Route
                path="dashboard"
                element={<Navigate to="products" replace />}
              />
              <Route path="dashboard" element={<AdminDashboard />}>
                <Route
                  path="products"
                  element={
                    <RouteForAdmin>
                      <AdminProducts />
                    </RouteForAdmin>
                  }
                />
                <Route
                  path="new-product"
                  element={
                    <RouteForAdmin>
                      <AdminAddNewProduct />
                    </RouteForAdmin>
                  }
                />
                <Route path="products" element={<AdminProducts />}/>
                <Route
                  path="categories"
                  element={
                    <RouteForAdmin>
                      <AdminCategories />
                    </RouteForAdmin>
                  }
                />
                <Route
                  path="manufacturers"
                  element={
                    <RouteForAdmin>
                      <AdminManufacturers />
                    </RouteForAdmin>
                  }
                />
                <Route
                  path="customers"
                  element={
                    <RouteForAdmin>
                      <AdminCustomerFind />
                    </RouteForAdmin>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <RouteForAdmin>
                      <AdminOrderFind />
                    </RouteForAdmin>
                  }
                />
                <Route
                  path="admins"
                  element={
                    <RouteForAdmin>
                      <AdminAdmins />
                    </RouteForAdmin>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="./" replace />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
