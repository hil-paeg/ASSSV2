

// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Upload, Search, FileText, Play, Eye, Clock, MessageSquare, ChevronDown, ChevronUp, Download } from 'lucide-react';
// import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

// const Knowledge = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [chatOpen, setChatOpen] = useState(false);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState('');

//   const documents = [
//     {
//       id: '1',
//       title: 'System Installation Guide',
//       fileName: 'installation-guide.pdf',
//       type: 'pdf',
//       uploadedBy: 'Admin Team',
//       uploadedAt: '2024-01-15',
//       projectId: 'proj-001',
//       size: '2.5 MB',
//       downloads: 45,
//     },
//     {
//       id: '2',
//       title: 'User Manual v2.1',
//       fileName: 'user-manual-v2.1.pdf',
//       type: 'pdf',
//       uploadedBy: 'Documentation Team',
//       uploadedAt: '2024-01-10',
//       projectId: 'proj-001',
//       size: '5.2 MB',
//       downloads: 128,
//     },
//     {
//       id: '3',
//       title: 'API Documentation',
//       fileName: 'api-docs.pdf',
//       type: 'pdf',
//       uploadedBy: 'Tech Team',
//       uploadedAt: '2024-01-08',
//       projectId: 'proj-002',
//       size: '1.8 MB',
//       downloads: 67,
//     },
//     {
//       id: '4',
//       title: 'Network Diagram',
//       fileName: 'network-diagram.png',
//       type: 'image',
//       uploadedBy: 'Network Admin',
//       uploadedAt: '2024-01-05',
//       projectId: 'proj-001',
//       size: '850 KB',
//       downloads: 23,
//     },
//   ];

//  const debuggingVideos = [
//     {
//       id: '1',
//       title: 'Network Connectivity Issues',
//       thumbnail: '/placeholder.svg',
//       duration: '45s',
//       views: 234,
//       uploadedBy: 'Tech Support',
//       uploadedAt: '2024-01-12',
//     },
//     {
//       id: '2',
//       title: 'Database Connection Fix',
//       thumbnail: '/placeholder.svg',
//       duration: '38s',
//       views: 156,
//       uploadedBy: 'Database Admin',
//       uploadedAt: '2024-01-10',
//     },
//     {
//       id: '3',
//       title: 'Server Restart Procedure',
//       thumbnail: '/placeholder.svg',
//       duration: '52s',
//       views: 189,
//       uploadedBy: 'System Admin',
//       uploadedAt: '2024-01-08',
//     },
//     {
//       id: '4',
//       title: 'Login Authentication Error',
//       thumbnail: '/placeholder.svg',
//       duration: '41s',
//       views: 298,
//       uploadedBy: 'Security Team',
//       uploadedAt: '2024-01-06',
//     },
//     {
//       id: '5',
//       title: 'Email Configuration Setup',
//       thumbnail: '/placeholder.svg',
//       duration: '59s',
//       views: 167,
//       uploadedBy: 'IT Support',
//       uploadedAt: '2024-01-04',
//     },
//   ];

//   const faqs = {
//     level1: [
//       { question: 'What are the basic components of a Level-1 control system?', answer: 'Core components include sensors, actuators, and a central controller for real-time monitoring.' },
//       { question: 'How to calibrate Level-1 sensors for temperature monitoring?', answer: 'Follow the calibration guide in the sensor manual, using a reference thermometer.' },
//       { question: 'Steps to configure PID loops in Hitachi R900 Controller?', answer: 'Access the controller interface, set P, I, and D parameters, and test with a simulation.' },
//     ],
//     level2: [
//       { question: 'What is the role of Level-2 systems in process optimization?', answer: 'Level-2 systems analyze data from Level-1 to optimize processes and improve efficiency.' },
//       { question: 'Steps for configuring data from Level-1 to Level-2 systems?', answer: 'Set up data pipelines using OPC UA or MQTT protocols for seamless integration.' },
//       { question: 'What is the task associated for interface with RMS system?', answer: 'Configure API endpoints to sync data between Level-2 and RMS systems.' },
//     ],
//     Troubleshooting: [
//       { question: 'How to resolve Profibus communication failures?', answer: 'Check cable connections, verify termination resistors, and ensure proper addressing of devices.' },
//       { question: 'What are the common PLC fault codes and their fixes?', answer: 'Common codes include 0x80 (power failure) and 0x81 (I/O error); reset power or check I/O modules.' },
//       { question: 'How to troubleshoot Huming.Net HMI connectivity?', answer: 'Verify network settings, check IP conflicts, and ensure HMI firmware is up to date.' },
//     ],
//   };

//   const filteredDocuments = documents.filter(doc =>
//     doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getFileIcon = (type) => {
//     const iconClass = 'h-6 w-6';
//     switch (type) {
//       case 'pdf': return <FileText className={`${iconClass} text-red-500`} />;
//       case 'docx': return <FileText className={`${iconClass} text-blue-500`} />;
//       default: return <FileText className={`${iconClass} text-gray-500`} />;
//     }
//   };

//   const handleChatSubmit = (e) => {
//     e.preventDefault();
//     if (!chatInput.trim()) return;
//     setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
//     setChatMessages(prev => [...prev, { sender: 'bot', text: 'This is a placeholder response. Integrate with a chatbot API.' }]);
//     setChatInput('');
//   };

//   const handleFaqClick = (question, answer) => {
//     setChatOpen(true); // Open the chatbot if it's closed
//     setChatMessages(prev => [
//       ...prev,
//       { sender: 'user', text: question },
//       { sender: 'bot', text: answer }
//     ]);
//   };

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
//       {/* Main Content */}
//       <div className="flex-1 space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
//             <p className="text-gray-600 mt-2">
//               Access project documentation, manuals, and shared resources
//             </p>
//           </div>
//           <Button className="flex items-center gap-2">
//             <Upload className="h-4 w-4" />
//             Upload Document
//           </Button>
//         </div>

//         {/* Search Bar */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 placeholder="Search documents..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Project Folders */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <Card className="hover:shadow-md transition-shadow cursor-pointer">
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <FileText className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">Project Alpha</h3>
//                   <p className="text-sm text-gray-500">15 documents</p>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600">
//                 Main project documentation and resources
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-md transition-shadow cursor-pointer">
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <FileText className="h-6 w-6 text-green-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">Project Beta</h3>
//                   <p className="text-sm text-gray-500">8 documents</p>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600">
//                 Secondary project files and manuals
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-md transition-shadow cursor-pointer">
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="p-2 bg-purple-100 rounded-lg">
//                   <FileText className="h-6 w-6 text-purple-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold">General Resources</h3>
//                   <p className="text-sm text-gray-500">12 documents</p>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600">
//                 Common tools and reference materials
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Documents List */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Documents</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {filteredDocuments.map((doc) => (
//                 <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="flex items-center gap-4">
//                     {getFileIcon(doc.type)}
//                     <div>
//                       <h4 className="font-medium text-gray-900">{doc.title}</h4>
//                       <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
//                         <span>{doc.fileName}</span>
//                         <Badge variant="outline">{doc.projectId}</Badge>
//                         <span>{doc.size}</span>
//                         <span>{doc.downloads} downloads</span>
//                       </div>
//                       <p className="text-xs text-gray-400 mt-1">
//                         Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button variant="outline" size="sm">
//                       <Download className="h-4 w-4 mr-1" />
//                       Download
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Video Debug Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Play className="h-5 w-5" />
//               Debug Video Shorts
//             </CardTitle>
//             <p className="text-sm text-gray-500">
//               Quick debugging videos to help resolve common issues
//             </p>
//           </CardHeader>
//           <CardContent>
//             <Carousel className="w-full">
//               <CarouselContent className="-ml-2 md:-ml-4">
//                 {debuggingVideos.map((video) => (
//                   <CarouselItem key={video.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
//                     <Card className="hover:shadow-md transition-shadow cursor-pointer group">
//                       <CardContent className="p-0">
//                         <div className="relative">
//                           <img
//                             src={video.thumbnail}
//                             alt={video.title}
//                             className="w-full h-40 object-cover rounded-t-lg"
//                           />
//                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors rounded-t-lg" />
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <div className="bg-black/70 rounded-full p-3 group-hover:bg-black/80 transition-colors">
//                               <Play className="h-6 w-6 text-white fill-white" />
//                             </div>
//                           </div>
//                           <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                             <div className="flex items-center gap-1">
//                               <Clock className="h-3 w-3" />
//                               {video.duration}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="p-4">
//                           <h4 className="font-medium text-sm line-clamp-2 mb-2">
//                             {video.title}
//                           </h4>
//                           <div className="flex items-center justify-between text-xs text-gray-500">
//                             <div className="flex items-center gap-1">
//                               <Eye className="h-3 w-3" />
//                               {video.views} views
//                             </div>
//                             <span>{new Date(video.uploadedAt).toLocaleDateString()}</span>
//                           </div>
//                           <p className="text-xs text-gray-400 mt-1">
//                             by {video.uploadedBy}
//                           </p>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </CarouselItem>
//                 ))}
//               </CarouselContent>
//               <CarouselPrevious className="left-2" />
//               <CarouselNext className="right-2" />
//             </Carousel>
//           </CardContent>
//         </Card>

//         {filteredDocuments.length === 0 && (
//           <Card>
//             <CardContent className="pt-6 text-center">
//               <p className="text-gray-500">No documents found matching your search.</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Updated Chatbot and FAQ Sidebar */}
//       <div className="lg:w-80 xl:w-96 space-y-6">
//         {/* Chatbot */}
//         <div className="relative">
//           <div className={`lg:sticky lg:top-4 z-50 w-full lg:w-80 xl:w-96 transition-all duration-300 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden ${chatOpen ? 'h-auto' : 'h-16'}`}>
//             <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-2xl cursor-pointer" onClick={() => setChatOpen(!chatOpen)}>
//               <div className="flex items-center gap-2">
//                 <MessageSquare className="h-5 w-5" />
//                 <span className="font-semibold text-lg">Support Chatbot</span>
//               </div>
//               {chatOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
//             </div>
//             {chatOpen && (
//               <div className="p-4 space-y-4 animate-slide-down">
//                 <div className="h-80 overflow-y-auto rounded-lg bg-gray-50 p-4 border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300">
//                   {chatMessages.length === 0 ? (
//                     <p className="text-gray-500 text-sm text-center pt-20">Ask me anything...</p>
//                   ) : (
//                     chatMessages.map((msg, index) => (
//                       <div key={index} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//                         <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
//                           {msg.text}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//                 <div className="flex gap-2">
//                   <input
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     placeholder="Type your question..."
//                     className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                   />
//                   <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors" onClick={handleChatSubmit}>
//                     Send
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* FAQ Section */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
//           {Object.keys(faqs).map((level) => (
//             <div key={level} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
//               <div className="p-4 bg-gray-100 font-semibold text-gray-800 capitalize">{level} Support</div>
//               <div className="divide-y divide-gray-200">
//                 {faqs[level].map((faq, index) => (
//                   <div
//                     key={index}
//                     className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
//                     onClick={() => handleFaqClick(faq.question, faq.answer)}
//                   >
//                     <div className="flex justify-between items-start">
//                       <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{faq.question}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Knowledge;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Upload, Search, FileText, Play, Eye, Clock, MessageSquare, ChevronDown, ChevronUp, Download, FileDown } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

const Knowledge = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqSearchTerm, setFaqSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: '1',
      title: 'System Installation Guide',
      fileName: 'installation-guide.pdf',
      type: 'pdf',
      uploadedBy: 'Admin Team',
      uploadedAt: '2024-01-15',
      projectId: 'proj-001',
      size: '2.5 MB',
      downloads: 45,
    },
    {
      id: '2',
      title: 'User Manual v2.1',
      fileName: 'user-manual-v2.1.pdf',
      type: 'pdf',
      uploadedBy: 'Documentation Team',
      uploadedAt: '2024-01-10',
      projectId: 'proj-001',
      size: '5.2 MB',
      downloads: 128,
    },
    {
      id: '3',
      title: 'API Documentation',
      fileName: 'api-docs.pdf',
      type: 'pdf',
      uploadedBy: 'Tech Team',
      uploadedAt: '2024-01-08',
      projectId: 'proj-002',
      size: '1.8 MB',
      downloads: 67,
    },
    {
      id: '4',
      title: 'Network Diagram',
      fileName: 'network-diagram.png',
      type: 'image',
      uploadedBy: 'Network Admin',
      uploadedAt: '2024-01-05',
      projectId: 'proj-001',
      size: '850 KB',
      downloads: 23,
    },
  ]);

  const [debuggingVideos, setDebuggingVideos] = useState([
    {
      id: '1',
      title: 'HPU download procedure',
      thumbnail: '/thumb1.png',
      duration: '45s',
      videoUrl: '/Debugging1.mp4',
      views: 234,
      uploadedBy: 'Tech Support',
      uploadedAt: '2024-01-12',
    },
    {
      id: '2',
      title: 'Remote download procedure',
      thumbnail: '/thumb2.png',
      duration: '38s',
      views: 156,
      uploadedBy: 'Database Admin',
      uploadedAt: '2024-01-10',
    },
    {
      id: '3',
      title: 'single module download procedure',
      thumbnail: '/thumb3.png',
      duration: '52s',
      views: 189,
      uploadedBy: 'System Admin',
      uploadedAt: '2024-01-08',
    },
    {
      id: '4',
      title: 'Adding an unregistered module',
      thumbnail: '/thumb1.png',
      duration: '41s',
      views: 298,
      uploadedBy: 'Security Team',
      uploadedAt: '2024-01-06',
    },
    {
      id: '5',
      title: 'Sheet number change procedure',
      thumbnail: '/thumb3.png',
      duration: '59s',
      views: 167,
      uploadedBy: 'IT Support',
      uploadedAt: '2024-01-04',
    },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);

  const faqs = {
    level1: [
      { question: 'What are the basic components of a Level-1 control system?', answer: 'Core components include sensors, actuators, and a central controller for real-time monitoring.' },
      { question: 'How to calibrate Level-1 sensors for temperature monitoring?', answer: 'Follow the calibration guide in the sensor manual, using a reference thermometer.' },
      { question: 'Steps to configure PID loops in Hitachi R900 Controller?', answer: 'Access the controller interface, set P, I, and D parameters, and test with a simulation.' },
    ],
    level2: [
      { question: 'What is the role of Level-2 systems in process optimization?', answer: 'Level-2 systems analyze data from Level-1 to optimize processes and improve efficiency.' },
      { question: 'Steps for configuring data from Level-1 to Level-2 systems?', answer: 'Set up data pipelines using OPC UA or MQTT protocols for seamless integration.' },
      { question: 'What is the task associated for interface with RMS system?', answer: 'Configure API endpoints to sync data between Level-2 and RMS systems.' },
    ],
    Troubleshooting: [
      { question: 'How to resolve Profibus communication failures?', answer: 'Check cable connections, verify termination resistors, and ensure proper addressing of devices.' },
      { question: 'What are the common PLC fault codes and their fixes?', answer: 'Common codes include 0x80 (power failure) and 0x81 (I/O error); reset power or check I/O modules.' },
      { question: 'How to troubleshoot Huming.Net HMI connectivity?', answer: 'Verify network settings, check IP conflicts, and ensure HMI firmware is up to date.' },
    ],
  };

  const filteredDocuments = documents.filter(doc =>
    (doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (projectFilter === 'all' || doc.projectId === projectFilter) &&
    (fileTypeFilter === 'all' || doc.type === fileTypeFilter)
  );

  const filteredVideos = debuggingVideos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFaqs = Object.keys(faqs).reduce((acc, level) => {
    const filtered = faqs[level].filter(faq =>
      faq.question.toLowerCase().includes(faqSearchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[level] = filtered;
    }
    return acc;
  }, {});

  const getFileIcon = (type) => {
    const iconClass = 'h-6 w-6';
    switch (type) {
      case 'pdf': return <FileText className={`${iconClass} text-red-500`} />;
      case 'image': return <FileText className={`${iconClass} text-purple-500`} />;
      case 'docx': return <FileText className={`${iconClass} text-blue-500`} />;
      default: return <FileText className={`${iconClass} text-gray-500`} />;
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
    setChatMessages(prev => [...prev, { sender: 'bot', text: 'This is a placeholder response. Integrate with a chatbot API.' }]);
    setChatInput('');
  };

  const handleFaqClick = (question, answer) => {
    setChatOpen(true);
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'bot', text: answer }
    ]);
  };

  const handleDownload = (doc) => {
    setDocuments(prev =>
      prev.map(d =>
        d.id === doc.id ? { ...d, downloads: d.downloads + 1 } : d
      )
    );
    setRecentActivity(prev => [
      { type: 'document', id: doc.id, title: doc.title, action: 'downloaded', timestamp: new Date().toISOString() },
      ...prev.slice(0, 4)
    ]);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
    setRecentActivity(prev => [
      { type: 'video', id: video.id, title: video.title, action: 'viewed', timestamp: new Date().toISOString() },
      ...prev.slice(0, 4)
    ]);
  };

  const handleExportFaqs = () => {
    // Placeholder for PDF export logic
    alert('Exporting FAQs as PDF... (Implement PDF generation logic here)');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
            <p className="text-gray-600 mt-2">
              Access project documentation, manuals, and shared resources
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white rounded-lg shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search documents and videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="proj-001">Project Alpha</SelectItem>
                    <SelectItem value="proj-002">Project Beta</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Folders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Project Alpha</h3>
                  <p className="text-sm text-gray-500">15 documents</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Main project documentation and resources
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Project Beta</h3>
                  <p className="text-sm text-gray-500">8 documents</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Secondary project files and manuals
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">General Resources</h3>
                  <p className="text-sm text-gray-500">12 documents</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Common tools and reference materials
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">No recent activity</p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 border-b border-gray-200">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {activity.title} {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="bg-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {getFileIcon(doc.type)}
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{doc.fileName}</span>
                        <Badge variant="outline">{doc.projectId}</Badge>
                        <span>{doc.size}</span>
                        <span>{doc.downloads} downloads</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {filteredDocuments.length === 0 && (
              <p className="text-gray-500 text-sm text-center mt-4">No documents found matching your criteria.</p>
            )}
          </CardContent>
        </Card>

        {/* Video Debug Section */}
        <Card className="bg-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Debug Video Shorts
            </CardTitle>
            <p className="text-sm text-gray-500">
              Quick debugging videos to help resolve common issues
            </p>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {filteredVideos.map((video) => (
                  <CarouselItem key={video.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => handleVideoClick(video)}>
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors rounded-t-lg" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/70 rounded-full p-3 group-hover:bg-black/80 transition-colors">
                              <Play className="h-6 w-6 text-white fill-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {video.duration}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-sm line-clamp-2 mb-2">
                            {video.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {video.views} views
                            </div>
                            <span>{new Date(video.uploadedAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            by {video.uploadedBy}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            {filteredVideos.length === 0 && (
              <p className="text-gray-500 text-sm text-center mt-4">No videos found matching your search.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chatbot and FAQ Sidebar */}
      <div className="lg:w-80 xl:w-96 space-y-6">
        {/* Chatbot */}
        <div className="relative">
          <div className={`lg:sticky lg:top-4 z-50 w-full lg:w-80 xl:w-96 transition-all duration-300 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden ${chatOpen ? 'h-auto' : 'h-16'}`}>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-t-2xl cursor-pointer" onClick={() => setChatOpen(!chatOpen)}>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="font-semibold text-lg">Support Chatbot</span>
              </div>
              {chatOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
            {chatOpen && (
              <div className="p-4 space-y-4 animate-slide-down">
                <div className="h-80 overflow-y-auto rounded-lg bg-gray-50 p-4 border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300">
                  {chatMessages.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center pt-20">Ask me anything...</p>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div key={index} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors" onClick={handleChatSubmit}>
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Search and Export */}
        <Card className="bg-white shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Frequently Asked Questions</span>
              <Button variant="outline" size="sm" onClick={handleExportFaqs}>
                <FileDown className="h-4 w-4 mr-1" />
                Export
              </Button>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search FAQs..."
                value={faqSearchTerm}
                onChange={(e) => setFaqSearchTerm(e.target.value)}
                className="pl-10 my-2"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(filteredFaqs).length === 0 ? (
                <p className="text-gray-500 text-sm text-center">No FAQs found matching your search.</p>
              ) : (
                Object.keys(filteredFaqs).map((level) => (
                  <div key={level} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4 bg-gray-100 font-semibold text-gray-800 capitalize">{level} Support</div>
                    <div className="divide-y divide-gray-200">
                      {filteredFaqs[level].map((faq, index) => (
                        <div
                          key={index}
                          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                          onClick={() => handleFaqClick(faq.question, faq.answer)}
                        >
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{faq.question}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Playback Overlay */}
      {isVideoModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[75%] max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h2>
              <Button variant="ghost" onClick={() => setIsVideoModalOpen(false)} className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </Button>
            </div>
            <video
              src={selectedVideo.videoUrl}
              controls
              className="w-full h-auto rounded-lg"
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
            <p className="text-sm text-gray-500 mt-2">
              Uploaded by {selectedVideo.uploadedBy} on {new Date(selectedVideo.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Knowledge;
