import {
 BrowserRouter as Router,
 Routes,
 Route,
 Navigate,
 useLocation,
 useNavigate,
} from 'react-router-dom';
import {
 FaSnowflake,
 FaBook,
 FaListAlt,
 FaShoppingCart,
 FaCarrot,
} from 'react-icons/fa';
import TabBar from './components/TabBar';
import Fridge from './pages/Fridge';
import Recipes from './pages/Recipes';
import Schedule from './pages/Schedule';
import ShoppingList from './pages/ShoppingList';
import Ingredients from './pages/Ingredients';
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';
import './App.scss';

const TABS = [
 { label: 'Ingredients', path: '/ingredients', icon: <FaCarrot /> },
 { label: 'Recipes', path: '/recipes', icon: <FaBook /> },
 { label: 'Schedule', path: '/schedule', icon: <FaListAlt /> },
 { label: 'Fridge', path: '/fridge', icon: <FaSnowflake /> },
 { label: 'Shopping List', path: '/shopping-list', icon: <FaShoppingCart /> },
];

function AppLayout() {
 const { user, logout } = useAuth();
 const location = useLocation();
 const navigate = useNavigate();
 const currentTab =
  TABS.find((tab) => location.pathname.startsWith(tab.path))?.label ||
  TABS[0].label;

 return (
  <div className='app-fullscreen-layout'>
   <nav className='sidebar-nav'>
    <TabBar
     tabs={TABS.map((t) => t.label)}
     icons={TABS.map((t) => t.icon)}
     current={currentTab}
     onTabChange={(tab) => {
      const found = TABS.find((t) => t.label === tab);
      if (found) navigate(found.path);
     }}
     orientation='vertical'
    />
   </nav>
   <main className='main-content'>
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
     {user ? (
      <>
       <span className='user-name-span'>
        Logged as <strong>{user.username || user.email}</strong>
       </span>
       <button
        onClick={() => {
         logout();
         navigate('/login');
        }}
       >
        Logout
       </button>
      </>
     ) : (
      <>
       <button onClick={() => navigate('/login')}>Login</button>
      </>
     )}
    </div>
    <Routes>
     <Route path='/login' element={<Login />} />
     {/* <Route path='/register' element={<Register />} /> */}

     <Route
      path='/ingredients'
      element={user ? <Ingredients /> : <Navigate to='/login' replace />}
     />
     <Route
      path='/recipes'
      element={user ? <Recipes /> : <Navigate to='/login' replace />}
     />
     <Route
      path='/schedule'
      element={user ? <Schedule /> : <Navigate to='/login' replace />}
     />
     <Route
      path='/fridge'
      element={user ? <Fridge /> : <Navigate to='/login' replace />}
     />
     <Route
      path='/shopping-list'
      element={user ? <ShoppingList /> : <Navigate to='/login' replace />}
     />

     <Route
      path='*'
      element={<Navigate to={user ? '/ingredients' : '/login'} replace />}
     />
    </Routes>
   </main>
  </div>
 );
}

function App() {
 return (
  <Router>
   <AppLayout />
  </Router>
 );
}

export default App;
