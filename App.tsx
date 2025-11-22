import React, { useState, useRef } from 'react';
import { Wand2, Download, Share2, Layout, Image as ImageIcon, Type, CheckCircle2, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import * as htmlToImage from 'html-to-image';
import { DesignType, GeneratedDesign } from './types';
import { generateDesignContent } from './services/gemini';
import DesignCanvas from './components/DesignCanvas';

const App: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [selectedType, setSelectedType] = useState<DesignType>(DesignType.POSTER);
  const [loading, setLoading] = useState(false);
  const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!textInput.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อความ',
        text: 'ใส่ข้อความที่คุณต้องการให้ AI ออกแบบ',
        confirmButtonColor: '#FF8F8F',
      });
      return;
    }

    setLoading(true);
    try {
      const design = await generateDesignContent(textInput, selectedType);
      setGeneratedDesign(design);
      
      // Scroll to preview on mobile
      setTimeout(() => {
         document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถสร้างดีไซน์ได้ในขณะนี้ กรุณาลองใหม่',
        confirmButtonColor: '#FF8F8F',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (canvasRef.current === null) return;

    try {
      // Use pixelRatio for higher quality export and cacheBust to avoid CORS caching issues
      const dataUrl = await htmlToImage.toPng(canvasRef.current, { 
        quality: 1.0, 
        pixelRatio: 2,
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = `pr-quick-design-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      Swal.fire({
        icon: 'success',
        title: 'บันทึกข้อมูลสำเร็จ',
        text: 'ไฟล์ภาพของคุณถูกดาวน์โหลดเรียบร้อยแล้ว',
        confirmButtonColor: '#B7A3E3',
        timer: 2000,
      });
    } catch (err) {
      console.error('Export failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'บันทึกไม่สำเร็จ',
        text: 'เกิดข้อผิดพลาดในการแปลงไฟล์ภาพ กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  const handleShare = async () => {
     if (canvasRef.current === null) return;
     
     try {
        const blob = await htmlToImage.toBlob(canvasRef.current, { 
            quality: 1.0, 
            pixelRatio: 2,
            cacheBust: true
        });
        if(blob && navigator.share) {
             const file = new File([blob], 'design.png', { type: 'image/png' });
             await navigator.share({
                title: 'PR Quick Design',
                text: 'ดูดีไซน์ที่ฉันสร้างด้วย AI!',
                files: [file]
             });
        } else {
            Swal.fire({
                title: 'Share not supported',
                text: 'เบราว์เซอร์นี้ไม่รองรับการแชร์ไฟล์ภาพโดยตรง',
                icon: 'info'
            })
        }
     } catch (error) {
         console.error("Sharing failed", error);
     }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pr-blue/20 to-pr-yellow/30 text-gray-800 pb-20">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-pr-pink p-2 rounded-lg text-white">
               <Wand2 size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pr-pink to-pr-purple">
              PR Quick Design
            </h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
             วิทยาลัยการอาชีพบ้านผือ
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Left Panel: Controls */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl ring-1 ring-gray-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Type className="text-pr-purple" />
                1. ใส่ข้อมูลของคุณ
              </h2>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  ข้อความที่ต้องการ (เช่น ชื่องาน, รายละเอียด, โปรโมชั่น)
                </label>
                <textarea
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pr-blue focus:border-transparent transition-all bg-gray-50 min-h-[120px]"
                  placeholder="เช่น: งานเปิดบ้านวิชาการ วันที่ 20 มกราคมนี้ พบกับกิจกรรมมากมาย..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>

              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  เลือกประเภทงานออกแบบ
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(DesignType).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all border-2 flex flex-col items-center gap-2
                        ${selectedType === type 
                          ? 'border-pr-pink bg-pr-pink/10 text-pr-pink' 
                          : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      {type === DesignType.POSTER && <Layout size={20}/>}
                      {type === DesignType.NAMECARD && <CheckCircle2 size={20}/>}
                      {type === DesignType.BANNER && <ImageIcon size={20}/>}
                      {type === DesignType.SOCIAL && <Share2 size={20}/>}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-8 w-full bg-gradient-to-r from-pr-pink to-pr-purple text-white py-4 rounded-xl font-bold text-lg shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> AI กำลังคิด...
                  </>
                ) : (
                  <>
                    <Wand2 /> AI Generate
                  </>
                )}
              </button>
            </div>
            
            {/* Tip Card */}
            <div className="bg-pr-yellow/50 p-6 rounded-2xl border border-pr-yellow text-sm text-gray-700">
               <strong>💡 Tip:</strong> ลองใส่รายละเอียดให้ครบถ้วน เพื่อให้ AI เลือก Layout ที่เหมาะสมที่สุดให้กับคุณ
            </div>
          </div>

          {/* Right Panel: Preview */}
          <div className="lg:col-span-3 flex flex-col items-center" id="preview-section">
             <div className="w-full flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ImageIcon className="text-pr-blue" />
                  2. ผลลัพธ์งานออกแบบ
                </h2>
                {generatedDesign && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleShare}
                      className="p-2 rounded-full bg-gray-100 hover:bg-pr-blue/20 text-gray-600 hover:text-pr-blue transition-colors"
                      title="Share"
                    >
                      <Share2 size={20} />
                    </button>
                    <button 
                      onClick={handleExport}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors shadow-md text-sm font-medium"
                    >
                      <Download size={18} /> บันทึกรูปภาพ
                    </button>
                  </div>
                )}
             </div>

             <div className="bg-gray-200/50 w-full h-[800px] rounded-3xl border-4 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                
                {!generatedDesign && !loading && (
                   <div className="text-center text-gray-400">
                      <Layout size={64} className="mx-auto mb-4 opacity-50" />
                      <p>ยังไม่มีดีไซน์<br/>กรอกข้อมูลและกด Generate เพื่อเริ่ม</p>
                   </div>
                )}

                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                     <div className="w-16 h-16 border-4 border-pr-pink border-t-transparent rounded-full animate-spin mb-4"></div>
                     <p className="text-pr-purple font-medium animate-pulse">กำลังออกแบบด้วย AI...</p>
                  </div>
                )}

                {generatedDesign && (
                  <div className="transform scale-75 sm:scale-90 lg:scale-100 origin-center transition-transform">
                     <DesignCanvas 
                        ref={canvasRef} 
                        design={generatedDesign} 
                        type={selectedType} 
                     />
                  </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;