import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
  Popover,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  AccountBalanceWallet as WalletIcon,
  BarChart as AnalyticsIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import ThemeToggle from '../shared/ThemeToggle';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { userService } from '../../services/api';

const drawerWidth = 240;

const Layout = ({ toggleTheme, mode }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSuccess } = useAlert();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to Loopr!', read: false },
    { id: 2, message: 'Your profile was updated.', read: false },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Close the drawer by default on mobile devices
  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  }, [isMobile]);

  // Close drawer on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    showSuccess('You have been successfully logged out');
    navigate('/login');
  };

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };
  const openNotif = Boolean(notifAnchorEl);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Navigation items
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
    { text: 'Wallet', icon: <WalletIcon />, path: '/wallet' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Message', icon: <MessageIcon />, path: '/message' },
  ];

  // Drawer content
  const drawer = (
    <div style={{ background: '#1A1C22', height: '100%', minWidth: 0 }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 1, sm: 2 } }}>
        <img src="/penta-logo.svg" alt="Penta Logo" style={{ height: 24, marginRight: 8, maxWidth: '80%' }} />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#fff', fontSize: { xs: 18, sm: 26 } }}>
          Penta
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#2D3142' }} />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              position: 'relative',
              backgroundColor: location.pathname === item.path ? 'rgba(22,243,129,0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(22,243,129,0.04)',
              },
              color: '#fff',
              borderRadius: 2,
              mb: 1,
              px: { xs: 1, sm: 2 },
              minWidth: 0,
            }}
          >
            <ListItemIcon sx={{ color: '#16F381', minWidth: { xs: 32, sm: 40 } }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} sx={{ display: 'block' }} />
            {location.pathname === item.path && (
              <Box
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: { xs: 24, sm: 32 },
                  width: 6,
                  borderRadius: '6px 0 0 6px',
                  background: '#FFA726', // Orange
                  boxShadow: '0 0 8px 2px #FFA72655',
                  transition: 'background 0.2s',
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
  
  // User profile menu
  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem disabled>
        <Typography variant="body2" color="textSecondary">
          Signed in as
        </Typography>
      </MenuItem>
      <MenuItem disabled>
        <Typography variant="body1" fontWeight="bold">
          {user?.email}
        </Typography>
      </MenuItem>
      <Divider />
      <MenuItem 
        component={Link} 
        to="/profile" 
        onClick={handleMenuClose}
      >
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem 
        component={Link} 
        to="/settings" 
        onClick={handleMenuClose}
      >
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: { xs: 'column', md: 'row' },
      background: '#282c35',
      width: '100vw',
      overflowX: 'hidden',
    }}>
      {/* Side Drawer - now above AppBar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            sx: {
              backgroundColor: isMobile && drawerOpen ? 'rgba(0,0,0,0.5)' : 'transparent',
              transition: 'background-color 0.3s',
            }
          }
        }}
        sx={{
          width: { xs: '80vw', sm: drawerWidth },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: { xs: '80vw', sm: drawerWidth },
            boxSizing: 'border-box',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            background: '#1a1c22',
            borderRight: '1px solid #232733',
            boxShadow: isMobile && drawerOpen ? '0 0 24px 0 #16F38144' : 'none',
            zIndex: theme.zIndex.drawer + 2,
            minWidth: 0,
          },
        }}
      >
        {drawer}
      </Drawer>
      {/* App Bar */}
      <AppBar position="fixed" sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: '#1a1c22',
        boxShadow: 'none',
        borderBottom: '1px solid #232733',
        ml: { md: `${drawerWidth}px` },
        width: { xs: '100vw', md: `calc(100vw - ${drawerWidth}px)` },
        left: 0,
      }}>
        <Toolbar sx={{
          minHeight: { xs: 56, sm: 64 },
          background: '#1a1c22',
          px: { xs: 1, sm: 3 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 0 },
        }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#16F381' }}
            aria-label="open sidebar"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            ml={{ xs: 2, sm: 6, md: 10 }}
            sx={{
              flexGrow: 1,
              fontSize: { xs: 16, sm: 24 },
              color: '#fff',
              textAlign: 'left',
              minWidth: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/transactions' && 'Transactions'}
            {location.pathname === '/profile' && 'Profile'}
            {location.pathname === '/wallet' && 'Wallet'}
            {location.pathname === '/analytics' && 'Analytics'}
            {location.pathname === '/message' && 'Message'}
          </Typography>
          {/* Responsive Search Bar */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              background: '#282c35',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              mr: 2,
              border: '1.5px solid #16F381',
              minWidth: 120,
              maxWidth: 240,
              width: '100%',
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontSize: 16,
                width: '100%',
                minWidth: 0,
              }}
            />
            <span style={{ color: '#16F381', marginLeft: 8, fontSize: 22, display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#16F381" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/></svg>
            </span>
          </Box>
          {/* Mobile search icon */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', mr: 1 }}>
            <IconButton size="small" sx={{ color: '#16F381' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#16F381" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/></svg>
            </IconButton>
          </Box>
          {/* Notification and Profile */}
          <IconButton color="inherit" sx={{ mr: { xs: 1, sm: 2 } }} onClick={handleNotifClick} aria-label="show notifications">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon sx={{ color: '#16F381', fontSize: { xs: 22, sm: 28 }, cursor: 'pointer' }} />
            </Badge>
          </IconButton>
          <Popover
            open={openNotif}
            anchorEl={notifAnchorEl}
            onClose={handleNotifClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { minWidth: 220, maxWidth: 320, p: 2, background: '#1A1C22', color: '#fff' } }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Notifications</Typography>
            {notifications.length === 0 ? (
              <Typography variant="body2">No notifications</Typography>
            ) : (
              <>
                {notifications.map((n) => (
                  <Box key={n.id} sx={{ mb: 1, fontWeight: n.read ? 400 : 700, color: n.read ? '#aaa' : '#16F381' }}>
                    {n.message}
                  </Box>
                ))}
                <Button size="small" color="success" onClick={handleMarkAllRead} sx={{ mt: 1 }}>
                  Mark all as read
                </Button>
              </>
            )}
          </Popover>
          <Button
            color="inherit"
            onClick={handleProfileMenuOpen}
            startIcon={
              <Avatar
                sx={{ width: 28, height: 28, bgcolor: '#16F381', color: '#181C23', fontWeight: 700, fontSize: { xs: 14, sm: 18 } }}
                alt={user?.firstName || 'User'}
              >
                {(user?.firstName?.[0] || 'U').toUpperCase()}
              </Avatar>
            }
            sx={{ fontSize: { xs: 12, sm: 16 }, color: '#fff', textTransform: 'none', fontWeight: 700, minWidth: 0, px: { xs: 1, sm: 2 } }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{user?.firstName || 'User'}</Box>
          </Button>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <ThemeToggle toggleTheme={toggleTheme} mode={mode} />
          </Box>
          {profileMenu}
        </Toolbar>
      </AppBar>
      {/* Overlay for mobile */}
      {isMobile && drawerOpen && (
        <Box
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: theme.zIndex.drawer - 1,
            transition: 'background 0.3s',
          }}
        />
      )}
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 3 },
          width: '100%',
          ml: { sm: 0 },
          marginTop: { xs: '56px', sm: '20px' },
          background: '#282c35',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
          maxWidth: '100vw',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
