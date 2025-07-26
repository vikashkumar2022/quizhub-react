import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Leaderboard as LeaderboardIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AccountCircle,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuizStore } from '../../store/quizStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, login, logout } = useQuizStore();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAuthSubmit = () => {
    if (isLoginMode) {
      login(formData.username, formData.email);
    } else {
      login(formData.username, formData.email);
    }
    setAuthOpen(false);
    setFormData({ username: '', email: '', password: '' });
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const navigationItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/' },
    { label: 'Leaderboard', icon: <LeaderboardIcon />, path: '/leaderboard' },
  ];

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box 
              display="flex" 
              alignItems="center" 
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <QuizIcon sx={{ mr: 1, fontSize: 32, color: '#6366f1' }} />
              <Typography 
                variant="h5" 
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                QuizHub
              </Typography>
              <Chip 
                label="React" 
                size="small" 
                sx={{ 
                  ml: 1,
                  background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
                  color: '#000',
                  fontSize: '10px',
                  fontWeight: 600
                }}
              />
            </Box>
          </motion.div>

          {/* Navigation */}
          <Box display="flex" alignItems="center" gap={2}>
            {navigationItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname === item.path ? '#6366f1' : 'rgba(255, 255, 255, 0.8)',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    '&:hover': {
                      background: 'rgba(99, 102, 241, 0.1)',
                    }
                  }}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}

            {/* User Section */}
            {currentUser ? (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Welcome, {currentUser.username}!
                </Typography>
                <IconButton onClick={handleMenuOpen}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                      fontSize: '14px',
                      fontWeight: 600
                    }}
                  >
                    {currentUser.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  startIcon={<LoginIcon />}
                  onClick={() => setAuthOpen(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                    color: '#ffffff',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                    }
                  }}
                >
                  Login
                </Button>
              </motion.div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Auth Dialog */}
      <Dialog 
        open={authOpen} 
        onClose={() => setAuthOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            {isLoginMode ? 'Welcome Back!' : 'Join QuizHub'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {isLoginMode 
              ? 'Sign in to continue your quiz journey' 
              : 'Create your account to start playing'
            }
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
              InputProps={{
                style: { color: '#ffffff' },
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6366f1',
                  },
                }
              }}
            />
            
            {!isLoginMode && (
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                InputProps={{
                  style: { color: '#ffffff' },
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6366f1',
                    },
                  }
                }}
              />
            )}
            
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
              InputProps={{
                style: { color: '#ffffff' },
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#6366f1',
                  },
                }
              }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Box width="100%" display="flex" flexDirection="column" gap={2}>
            <Button
              onClick={handleAuthSubmit}
              fullWidth
              disabled={!formData.username || !formData.password}
              sx={{
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                },
                '&:disabled': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.5)'
                }
              }}
            >
              {isLoginMode ? 'Sign In' : 'Create Account'}
            </Button>
            
            <Box textAlign="center">
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <Button
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  sx={{ 
                    color: '#6366f1', 
                    textTransform: 'none',
                    fontWeight: 600,
                    p: 0,
                    minWidth: 'auto'
                  }}
                >
                  {isLoginMode ? 'Sign Up' : 'Sign In'}
                </Button>
              </Typography>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
