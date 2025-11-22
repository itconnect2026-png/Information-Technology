import React, { forwardRef } from 'react';
import { DesignType, GeneratedDesign } from '../types';

interface DesignCanvasProps {
  design: GeneratedDesign;
  type: DesignType;
}

const DesignCanvas = forwardRef<HTMLDivElement, DesignCanvasProps>(({ design, type }, ref) => {
  
  // Dimension classes based on type
  const getDimensions = () => {
    switch (type) {
      case DesignType.NAMECARD: return 'w-[500px] h-[300px]';
      case DesignType.BANNER: return 'w-[800px] h-[300px]';
      case DesignType.SOCIAL: return 'w-[500px] h-[500px]';
      case DesignType.POSTER: default: return 'w-[500px] h-[700px]';
    }
  };

  const dimensions = getDimensions();

  // Layout logic
  const getLayoutStyles = () => {
    switch (design.layoutStyle) {
      case 'bold':
        return {
          container: 'flex flex-col justify-center items-center text-center p-8 border-[16px]',
          headline: 'text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-sm',
          sub: 'text-2xl font-bold opacity-90 mb-6 bg-white/40 px-6 py-2 rounded-full backdrop-blur-sm',
          body: 'text-lg font-medium leading-relaxed max-w-[90%]',
          emoji: 'text-8xl mb-6 filter drop-shadow-lg transform hover:scale-110 transition-transform'
        };
      case 'creative':
        return {
          container: 'flex flex-col justify-between p-10',
          headline: 'text-5xl font-extrabold mb-4 rotate-[-2deg] origin-bottom-left leading-tight',
          sub: 'text-xl italic mb-auto border-l-4 pl-4 border-current opacity-80',
          body: 'text-lg font-medium bg-white/70 p-6 rounded-2xl backdrop-blur-md shadow-xl mt-8 transform rotate-[1deg]',
          emoji: 'text-7xl absolute top-8 right-8 rotate-12'
        };
      case 'modern':
        return {
          container: 'flex flex-col items-start justify-end p-12 text-left',
          headline: 'text-6xl font-bold mb-4 leading-none tracking-tight',
          sub: 'text-2xl font-light mb-8 opacity-80',
          body: 'text-base font-normal leading-7 border-t-2 border-current pt-6 w-full max-w-[85%]',
          emoji: 'text-6xl absolute top-12 right-12 opacity-80 bg-white/30 p-4 rounded-full'
        };
      default: // minimal
        return {
          container: 'flex flex-col justify-center items-start p-12',
          headline: 'text-4xl font-bold mb-3 tracking-wide',
          sub: 'text-lg uppercase tracking-widest mb-10 opacity-70',
          body: 'text-md leading-8 border-l-2 pl-6 border-current max-w-md',
          emoji: 'text-5xl mb-8 bg-white/60 p-4 rounded-2xl shadow-sm backdrop-blur-sm'
        };
    }
  };

  const styles = getLayoutStyles();
  const textColor = design.textColor || '#1a202c';

  return (
    <div 
      ref={ref}
      className={`${dimensions} shadow-2xl relative overflow-hidden transition-all duration-500 bg-white mx-auto`}
      style={{ backgroundColor: design.backgroundColor }}
    >
      {/* Randomly Generated Decorative Elements */}
      {design.decorativeElements && design.decorativeElements.map((el) => (
        <div
          key={el.id}
          style={el.style}
          className="pointer-events-none"
        />
      ))}

      {/* Main Content */}
      <div 
        className={`relative h-full w-full z-10 ${styles.container}`}
        style={{ borderColor: design.accentColor, color: textColor }}
      >
        {/* Conditional Emoji Placement */}
        {design.layoutStyle !== 'creative' && design.layoutStyle !== 'modern' && (
           <div className={styles.emoji}>{design.emojiIcon}</div>
        )}
        { (design.layoutStyle === 'creative' || design.layoutStyle === 'modern') && (
           <div className={styles.emoji}>{design.emojiIcon}</div>
        )}
        
        <h1 
          className={styles.headline}
          style={{ color: design.layoutStyle === 'bold' ? design.accentColor : 'inherit' }}
        >
          {design.headline}
        </h1>
        
        <h2 className={styles.sub}>
          {design.subheadline}
        </h2>
        
        <p className={styles.body}>
          {design.bodyText}
        </p>

        {/* Footer Copyright */}
        <div 
          className="absolute bottom-3 left-0 w-full text-center text-[10px] opacity-60 font-light pointer-events-none"
          style={{ color: textColor }}
        >
           Copyright © โดย วิทยาลัยการอาชีพบ้านผือ
        </div>
      </div>
    </div>
  );
});

export default DesignCanvas;