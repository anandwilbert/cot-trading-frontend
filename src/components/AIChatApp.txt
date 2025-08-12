"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, TextField, Button, List, ListItem, Paper, Typography, CircularProgress } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';


// Define the Message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}


function AIChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  // Explicitly type the ref as HTMLDivElement or null
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = { id: uuidv4(), text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Call the Next.js API route
      //const response = await fetch('/api/chat', {
      const response = await fetch('/api/strategychat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //prompt: newUserMessage.text,
          question: newUserMessage.text,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      console.log(data.response)

      const aiResponseText = data.response;


      //const data = await response.json();
      //const aiResponseText = data.choices?.[0]?.message?.content || 'AI: Sorry, I could not respond.';



      const aiResponse: Message = { id: uuidv4(), text: aiResponseText, sender: 'ai' };
      setMessages((prev) => [...prev, aiResponse]);

    } catch (error) {
      console.error('API Error:', error);
      const errorMessage: Message = { id: uuidv4(), text: 'AI: Error connecting to the server.', sender: 'ai' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false}
        sx={{
        px: { xs: 1, sm: 2, md: 3 }, // Responsive padding
        maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: '1200px', xl: '1600px' }, // Custom breakpoints
        bgcolor: 'background.default', // Use dark theme background
      }}
    >
      <Paper elevation={3} 
       sx={{
          p: { xs: 1, sm: 2 }, // Responsive padding
          height: { xs: '85vh', sm: '80vh', md: '85vh' }, // Adjust height for smaller screens
          display: 'flex',
          flexDirection: 'column',
          width: '100%', // Take full container width
          maxWidth: '100%', // Ensure no overflow
          boxSizing: 'border-box',
          bgcolor: 'background.paper', // Slightly lighter dark background
        }}  
      >
        <Box
        sx={{
            flexGrow: 1,
            overflowY: 'auto',
            mb: { xs: 1, sm: 2 }, // Responsive margin
            px: { xs: 1, sm: 0 }, // Add padding on small screens
          }}
        >
          <List>
            {messages.map((msg) => (
              <ListItem key={msg.id} 
                ={{ 
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    sxpx: { xs: 0, sm: 1 }, // Responsive padding 
                }}>
                <Paper 
                    sx={{
                    p: 1,
                    //backgroundColor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                    backgroundColor: msg.sender === 'user' ? 'grey.400' : 'background.default',
                    //backgroundColor: msg.sender === 'user' ? 'primary.main' : 'secondary.main',
                    maxWidth: { xs: '90%', sm: '80%', md: '70%' }, // Responsive message width
                    color: 'text.primary', // White text for readability
                  }}
                >
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        p: ({ children }) => <Typography variant="body1" color="text.primary">{children}</Typography>,
                        ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>{children}</ul>,
                        ol: ({ children }) => <ol style={{ margin: '8px 0', paddingLeft: '20px'}}>{children}</ol>,
                        li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
                        strong: ({ children }) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
                        em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                        code: ({ children }) => (
                          <code
                            style={{
                              backgroundColor: '#2d2d2d', // Darker code background
                              padding: '2px 4px',   
                              borderRadius: '4px',
                              fontFamily: 'monospace',
                              color: '#e0e0e0', // Light gray for code text
                            }}
                          >
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre
                            style={{
                              backgroundColor: '#2d2d2d',
                              padding: '8px',
                              borderRadius: '4px',
                              overflowX: 'auto',
                              color: '#e0e0e0',
                            }}
                          >
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    <Typography variant="body1"  color="text.primary">{msg.text}</Typography>
                  )}
                </Paper>
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <CircularProgress size={20} />
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', px: { xs: 1, sm: 0 }  }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
                color: 'text.primary',
                '& fieldset': {
                  borderColor: 'text.secondary',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }

            }
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            sx={{ ml: 1 }}
            disabled={!inputValue.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AIChatApp;