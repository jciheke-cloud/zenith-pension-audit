import React, { useRef, useEffect } from 'react';

const TopScrollTableWrapper = ({ children }) => {
  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const topScroll = topScrollRef.current;
    const bottomScroll = bottomScrollRef.current;
    const content = contentRef.current;

    if (!topScroll || !bottomScroll || !content) return;

    const updateWidths = () => {
      try {
        if (content && bottomScroll && topScroll && content.scrollWidth > bottomScroll.clientWidth) {
          topScroll.style.display = 'block';
          if (topScroll.firstChild) {
            topScroll.firstChild.style.width = `${content.scrollWidth}px`;
          }
        } else if (topScroll) {
          topScroll.style.display = 'none';
        }
      } catch (err) {
        console.error('Resize observer error in TopScrollTableWrapper', err);
      }
    };

    updateWidths();
    const resizeObserver = new ResizeObserver(updateWidths);
    resizeObserver.observe(content);
    resizeObserver.observe(bottomScroll);

    const handleTopScroll = () => {
      bottomScroll.scrollLeft = topScroll.scrollLeft;
    };
    const handleBottomScroll = () => {
      topScroll.scrollLeft = bottomScroll.scrollLeft;
    };

    topScroll.addEventListener('scroll', handleTopScroll);
    bottomScroll.addEventListener('scroll', handleBottomScroll);

    return () => {
      resizeObserver.disconnect();
      if (topScroll) topScroll.removeEventListener('scroll', handleTopScroll);
      if (bottomScroll) bottomScroll.removeEventListener('scroll', handleBottomScroll);
    };
  }, [children]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div 
        ref={topScrollRef} 
        className="top-scrollbar-wrapper"
        style={{ overflowX: 'auto', overflowY: 'hidden', height: '10px', marginBottom: '4px' }}
      >
        <div style={{ height: '10px' }}></div>
      </div>
      <div 
        ref={bottomScrollRef} 
        style={{ overflowX: 'auto', width: '100%' }}
        className="bottom-scrollbar-wrapper"
      >
        <div ref={contentRef} style={{ minWidth: 'max-content' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TopScrollTableWrapper;
