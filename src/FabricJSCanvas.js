import React, {useEffect, useRef, useState} from 'react'
import {fabric} from 'fabric'

import './App.css'

const FabricJSCanvas = () => {
    const [canvas, setCanvas] = useState()
    const canvasEl = useRef(null)
    const inputFileRef = useRef(null)
    const reader = new FileReader()
    const imgAdded = (e) => {
        const file = inputFileRef.current.files[0];
        reader.readAsDataURL(file)
      }
    function regularPolygonPoints(sideCount, radius) {
        var sweep = Math.PI * 2 / sideCount;
        var cx = radius;
        var cy = radius;
        var points = [];
        for (var i = 0; i < sideCount; i++) {
            var x = cx + radius * Math.cos(i * sweep);
            var y = cy + radius * Math.sin(i * sweep);
            points.push({
                x: x,
                y: y
            });
        }
        return (points);
    }

    useEffect(() => {
        const options = {};

        const canvas = new fabric.Canvas(canvasEl.current, options);
        canvas.perPixelTargetFind = true;
        canvas.targetFindTolerance = 4;

        const t = new fabric.Triangle({
            top: 300,
            left: 210,
            width: 100,
            height: 100,
            fill: "blue",
            erasable: false
        });
        canvas.add(t)
        reader.addEventListener("load", () => {
            fabric.Image.fromURL(reader.result, img => {
                canvas.add(img)
                canvas.requestRenderAll()
            })
          })
          
          inputFileRef.current.addEventListener('change', imgAdded)
        setCanvas(canvas)
        return () => {
        //   updateCanvasContext(null);
        canvas.dispose()
        }
    }, []);

    function addHex() {
        var id = Date.now();
        var points = regularPolygonPoints(6, 50);
        var myPoly = new fabric.Polygon(points, {
            id: id,
            left: canvas.width / 2,
            top: canvas.height / 2,
            width: 100,
            height: 100,
            originX: 'center',
            originY: 'center',
            fill: 'rgba(0,0,0,0)',
            stroke: 'black',
            strokeWidth: 3
        }, false);
        canvas.add(myPoly);
    }
    
    function addRect() {
        var id = Date.now();
        canvas.add(new fabric.Rect({
            id: id,
            left: canvas.width / 2,
            top: canvas.height / 2,
            fill: 'rgba(0,0,0,0)',
            stroke: 'black',
            width: 50,
            height: 50,
            originX: 'center',
            originY: 'center',
            strokeWidth: 3
    
        }));
    }

    function clearCanvas() {
        canvas.clear();
    }

    function select() {
        // mode = "select";
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.renderAll();
    }
    function group() {
        if (!canvas.getActiveObject()) {
            return;
          }
          if (canvas.getActiveObject().type !== 'activeSelection') {
            return;
          }
          canvas.getActiveObject().toGroup();
          canvas.requestRenderAll();
    }
    function unGroup() {
        if (!canvas.getActiveObject()) {
          return;
        }
        if (canvas.getActiveObject().type !== 'group') {
          return;
        }
        canvas.getActiveObject().toActiveSelection();
        canvas.requestRenderAll();
      }

      function startDraw() {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 3;
        fabric.PencilBrush.prototype.globalCompositeOperation = "source-over";
        canvas.renderAll();
    }
  return (
    <>
        
    <h2>Canvas</h2>
    <div className="container">

        <div className="button-container" id="button-container">
            <button onClick={startDraw} id="button-draw" className="button"  title="Draw"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/draw.svg" /> </button>
            <button onClick={clearCanvas} id="button-clear" className="button"  title="Clear All"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/clear-all.svg" /></button>
            <button onClick={select} id="button-select" className="button"  title="Select"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/select.svg" /> </button>
            <button onClick={addHex} id="button-hex" className="button"   title="Hexagon"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/hexagon.svg" /></button>
            <button id="button-pent" className="button"  title="Pentagon"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/pentagon.svg" /></button>
            <button id="button-tri" className="button"  title="Triangle"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/triangle.svg" /></button>
            <button onClick={addRect} id="button-rec" className="button"  title="Rectangle"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/rectangle.svg" /></button>
            <button onClick={group} className="button btn-text"  title="group">group</button>
            <button onClick={unGroup} className="button btn-text"  title="unGroup">un group</button>
            <button id="button-subscript" className="button"  title="Subscript"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/text-sub.svg" /></button>
            <button id="button-superscript" className="button"  title="Superscript"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/text-sup.svg" /></button>
            <button id="button-line" className="button"  title="Arrow"><img alt='' src="https://raw.githubusercontent.com/craigmateo/chemistry-drawing/77de15031ab1d4dab25e25269d46334f9143ddaa/assets/svg/arrow.svg" /></button>

            <button id="button-save" className="button"  style={{display:"none"}}>Save</button>

            <input ref={inputFileRef} id="filereader" name='filereader' type="file" accept="image/*" />
            <label htmlFor="filereader" className="custom-file-upload" title="Upload Image">
                upload
            </label>
        </div>

        <div id="context-menu">
            <div className="item" id="toAdelante" hidden>Bring forward</div>
            <div className="item" id="tofront" hidden>Bring to front</div>
            <div className="item" id="toAtras" hidden>Send backwards</div>
            <div className="item" id="toback" hidden>Send to back</div>
        </div>

        <canvas id="a" width="632px" height="500" ref={canvasEl}></canvas>

    </div>
    </>
  )
}
export default FabricJSCanvas;