import React, { useEffect, useRef } from 'react';
import { Avatar, Box, Text, Flex, useColorModeValue, Spinner } from '@chakra-ui/react';
import { keyframes, css } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Message } from '../types/chat';

// Define fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Define typing cursor animation
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest = false }) => {
  const { role, content, timestamp, isThinking } = message;
  const prevContentRef = useRef('');
  const isStreaming = isLatest && prevContentRef.current !== content && !isThinking;
  
  // Update the ref when content changes
  useEffect(() => {
    // Small delay to ensure we don't immediately lose the streaming state
    const timer = setTimeout(() => {
      prevContentRef.current = content;
    }, 500);
    
    return () => clearTimeout(timer);
  }, [content]);
  
  // Enhanced color mode values
  const bgColor = useColorModeValue(
    role === 'user' ? 'blue.50' : 'white',
    role === 'user' ? 'blue.800' : 'gray.800'
  );
  const borderColor = useColorModeValue(
    role === 'user' ? 'blue.400' : 'purple.400',
    role === 'user' ? 'blue.600' : 'purple.600'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  const codeStyle = useColorModeValue(oneLight, tomorrow);
  
  // Format timestamp
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Animation style for latest message
  const animation = isLatest && !isStreaming ? `${fadeIn} 0.3s ease-out` : undefined;

  // Cursor style for streaming text
  const cursorStyle = isStreaming ? css`
    &::after {
      content: '|';
      display: inline-block;
      color: ${useColorModeValue('blue.500', 'blue.300')};
      animation: ${blink} 1s step-end infinite;
      margin-left: 2px;
    }
  ` : undefined;

  return (
    <Flex 
      direction="row" 
      alignItems="flex-start" 
      mb={4} 
      width="100%"
      animation={animation}
      role="group"
      aria-label={`${role} message`}
      style={{ minHeight: isStreaming || isThinking ? '80px' : 'auto' }}
    >
      <Avatar 
        size="sm" 
        name={role === 'user' ? 'You' : 'Claude'} 
        bg={role === 'user' ? 'blue.500' : 'purple.500'} 
        mr={3} 
        boxShadow="sm"
        flexShrink={0}
      />
      <Box 
        bg={bgColor} 
        p={4} 
        borderRadius="lg" 
        width="auto"
        maxW={{ base: 'calc(100% - 40px)', md: 'calc(100% - 40px)' }}
        flexGrow={1}
        boxShadow="sm"
        borderLeftWidth="2px"
        borderLeftColor={borderColor}
        position="relative"
        _hover={{
          boxShadow: "md"
        }}
        transition="all 0.2s ease"
        overflowX="auto"
        wordBreak="break-word"
        pb={8} // Add padding at bottom for timestamp
        minH={isStreaming || isThinking ? '80px' : 'auto'}
        opacity={isThinking ? 0.8 : 1}
      >
        {isThinking ? (
          <Flex align="center" opacity={0.8}>
            <Spinner size="xs" mr={2} color="purple.500" />
            <Text color={textColor}>Claude is thinking...</Text>
          </Flex>
        ) : (
          <Box 
            mb={2} 
            overflowWrap="break-word"
            css={cursorStyle}
            width="100%"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <Box 
                      my={4} 
                      borderRadius="md" 
                      overflow="auto" 
                      maxW="100%"
                    >
                      <SyntaxHighlighter
                        style={codeStyle}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </Box>
                  ) : (
                    <Text
                      as="code"
                      px={1}
                      bg={useColorModeValue("gray.100", "gray.700")}
                      borderRadius="sm"
                      fontSize="0.875em"
                      fontFamily="monospace"
                      overflowWrap="break-word"
                      {...props}
                    >
                      {children}
                    </Text>
                  );
                },
                p({children}) {
                  return <Text mb={4} overflowWrap="break-word">{children}</Text>;
                },
                h1({children}) {
                  return <Text as="h1" fontSize="2xl" fontWeight="bold" my={4} overflowWrap="break-word">{children}</Text>;
                },
                h2({children}) {
                  return <Text as="h2" fontSize="xl" fontWeight="bold" my={3} overflowWrap="break-word">{children}</Text>;
                },
                h3({children}) {
                  return <Text as="h3" fontSize="md" fontWeight="bold" my={2} overflowWrap="break-word">{children}</Text>;
                },
                ul({children}) {
                  return <Box as="ul" pl={5} my={3} overflowX="auto" width="100%">{children}</Box>;
                },
                ol({children}) {
                  return <Box as="ol" pl={5} my={3} overflowX="auto" width="100%">{children}</Box>;
                },
                li({children}) {
                  return <Box as="li" mb={1} overflowWrap="break-word">{children}</Box>;
                },
                blockquote({children}) {
                  return (
                    <Box 
                      borderLeftWidth="3px" 
                      borderLeftColor={useColorModeValue("gray.300", "gray.500")} 
                      pl={3} 
                      py={1} 
                      my={3}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="sm"
                      overflowX="auto"
                      fontStyle="italic"
                      width="100%"
                    >
                      {children}
                    </Box>
                  );
                },
                pre({children}) {
                  return (
                    <Box overflowX="auto" maxW="100%" width="100%">
                      {children}
                    </Box>
                  );
                },
                table({children}) {
                  return (
                    <Box overflowX="auto" maxW="100%" my={3} width="100%">
                      <Box 
                        as="table" 
                        width="full" 
                        borderWidth="1px" 
                        borderRadius="md"
                        borderColor={useColorModeValue("gray.200", "gray.600")}
                        fontSize="sm"
                      >
                        {children}
                      </Box>
                    </Box>
                  );
                },
                th({children}) {
                  return (
                    <Box 
                      as="th" 
                      bg={useColorModeValue("gray.50", "gray.700")}
                      p={2}
                      borderBottomWidth="1px"
                      borderColor={useColorModeValue("gray.200", "gray.600")}
                      fontWeight="semibold"
                      textAlign="left"
                    >
                      {children}
                    </Box>
                  );
                },
                td({children}) {
                  return (
                    <Box 
                      as="td" 
                      p={2}
                      borderBottomWidth="1px"
                      borderColor={useColorModeValue("gray.200", "gray.600")}
                      borderRightWidth="1px"
                      _last={{ borderRightWidth: 0 }}
                    >
                      {children}
                    </Box>
                  );
                },
                a({children, href}) {
                  return (
                    <Text 
                      as="a" 
                      href={href} 
                      color={useColorModeValue("blue.500", "blue.300")}
                      textDecoration="underline"
                      _hover={{ color: useColorModeValue("blue.600", "blue.400") }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </Text>
                  );
                },
                hr() {
                  return <Box as="hr" my={3} borderColor={useColorModeValue("gray.200", "gray.600")} width="100%" />;
                },
                img({src, alt}) {
                  return (
                    <Box my={3} borderRadius="md" overflow="hidden" maxW="100%">
                      <Box as="img" src={src} alt={alt} maxW="100%" />
                    </Box>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </Box>
        )}
        <Text 
          fontSize="xs" 
          color={textColor} 
          opacity={0.6} 
          position="absolute"
          bottom="2"
          right="3"
        >
          {formattedTime}
        </Text>
      </Box>
    </Flex>
  );
};

export default ChatMessage; 