import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Character.module.scss';

const cx = classNames.bind(styles);

const canvasWidth = 851;
const canvasHeight = 1418;

const dataObject = {
  pers: ['man', 'woman'],
  tshort: ['white', 'green', 'sber', 'purple'],
  jeans: ['blue', 'green'],
  jacket: ['gray', 'yellow', 'without'],
};

const defaultCanvasParams = {
  pers: 'man',
  tshort: 'white',
  jeans: 'blue',
  jacket: 'gray',
};

const Character = () => {
  const [canvasParams, setCanvasParams] = useState(defaultCanvasParams);
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(document.createElement('canvas'));

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');
  //   canvas.width = canvasWidth;
  //   canvas.height = canvasHeight;
  //   canvasFill(ctx);

  //   const pictures = createPicturesObj();
  //   canvasUpdate(ctx, pictures);
  // }, [canvasParams]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const offscreenCtx = offscreenCanvas.getContext('2d');

    offscreenCanvas.width = canvasWidth;
    offscreenCanvas.height = canvasHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvasFill(ctx);

    const pictures = createPicturesObj();
    canvasUpdate(offscreenCtx, pictures).then(() => {
      // Копируем содержимое off-screen canvas на основной canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(offscreenCanvas, 0, 0);
    });
  }, [canvasParams]);

  const createPicturesObj = () => {
    let pictures = {};
    for (let key in canvasParams) {
      pictures[key] = `./src/assets/${key}-${canvasParams[key]}.png`;
    }
    console.log('Pictures Object:', pictures);
    return pictures;
  };

  const canvasFill = (ctx, color = 'white') => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const drawImage = (ctx, src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener('load', () => {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        resolve();
      });
      img.addEventListener('error', () => {
        console.log('Image load error:', img.src);
        reject(new Error('Image download error'));
      });
      img.src = src;
    });
  };

  const canvasUpdate = async (ctx, pictures) => {
    canvasFill(ctx);
    try {
      await drawImage(ctx, pictures['pers']);
      await drawImage(ctx, pictures['tshort']);
      await drawImage(ctx, pictures['jeans']);
      if (!pictures['jacket'].includes('without')) {
        await drawImage(ctx, pictures['jacket']);
      }
    } catch (e) {
      console.log('Canvas update error:', e.message);
    }
  };

  const handleInputChange = (e) => {
    const params = parseName(e.target.dataset.name);
    setCanvasParams((prev) => ({ ...prev, ...params }));
  };

  const parseName = (name) => {
    const parts = name.split('-');
    if (parts.length !== 2) {
      throw new Error('Invalid name format');
    }
    return { [parts[0]]: parts[1] };
  };

  const downloadCanvasAsImage = () => {
    const canvas = canvasRef.current;
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'avatar.png');
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
  };

  const copyCanvasToBuffer = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]);
    });
  };

  const createPersBlock = (obj) => {
    return Object.keys(obj).map((key) => (
      <div className={cx('form-section')} key={key}>
        {obj[key].map((elem) => {
          const id = `${key}_${elem}`;
          return (
            <React.Fragment key={id}>
              <input
                type="radio"
                id={id}
                className={cx('checkbox-input')}
                name={key}
                data-name={`${key}-${elem}`}
                onClick={handleInputChange}
              />
              <label htmlFor={id} className={cx('checkbox-label')}>
                <img
                  className={cx('"wear__img"')}
                  src={`./src/assets/prev_${key}-${elem}.png`}
                  alt={`${key}-${elem}`}
                />
              </label>
            </React.Fragment>
          );
        })}
      </div>
    ));
  };

  return (
    <div
    // id="app"
    >
      <div className={cx('container', 'container-character')}>
        <canvas ref={canvasRef} className={cx('ctx')}></canvas>
        <form className={cx('"wear"')}>
          {createPersBlock(dataObject)}
          <div className={cx('wear__btns')}>
            <button
              type="button"
              className={cx('wear__btn', 'button-green')}
              onClick={downloadCanvasAsImage}
            >
              Download
            </button>
            <button
              type="button"
              className={cx('wear__btn', 'button-green')}
              onClick={copyCanvasToBuffer}
            >
              Copy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Character;
