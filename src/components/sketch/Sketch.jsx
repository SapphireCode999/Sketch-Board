import React, { useRef, useEffect, useState } from 'react'
import './sketch.css'
import { MdBrush } from 'react-icons/md'
import { FaEraser } from 'react-icons/fa'
import { MdClear } from 'react-icons/md'
import { MdDownload } from 'react-icons/md'



const Sketch = () => {

    const canvasRef = useRef(null)
    const contextRef = useRef(null)

    const [isDrawing, setIsDrawing] = useState(false)
    const [selectedColor, setSelectedColor] = useState('green')
    const [brushSize, setBrushSize] = useState(5)

    useEffect(() => {
        const canvas = canvasRef.current
        
        const context = canvas.getContext('2d')
        context.lineCap = 'round'
        context.lineJoin = 'round'
        context.strokeStyle = selectedColor
        context.lineWidth = brushSize
        contextRef.current = context
    }, [selectedColor, brushSize])
    
    const startDrawing = ({ nativeEvent }) => {
        const {offsetX, offsetY} = nativeEvent
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
    }

    const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
    }

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return
        }
        const { offsetX, offsetY } = nativeEvent
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
    }

    const clearCanvas = (e) => {
        e.preventDefault()
        contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height)
    }

    const downloadCanvas = async () => {
        const image = canvasRef.current.toDataURL('image/png');
        const blob = await (await fetch(image)).blob();
        const blobURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = "image.png";
        link.click();
    }

    const erase = (e) => {
        e.preventDefault()
        contextRef.current.globalCompositeOperation = 'destination-out'
        draw()
    }


    return (
        <div className='screen'>
            <h1>Sketch it your way!</h1>
            
            <canvas
                className='board'
                ref={canvasRef}
                style={{
                    borderRadius: '20px'
                }}
                width = {800}
                height={600}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
            />

            <section className='tools'>
                <form>
                    <label htmlFor="paintColor"></label>
                    <input
                        className='color-picker'
                        type="color"
                        name="paintColor"
                        id="paintColor"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                    />
                </form>
                <div className='brush'>
                    <span><MdBrush/></span>
                    <input type="range"
                        min="1" max="40"
                        name='pen-range'
                        value={brushSize}
                        className="pen-range"
                        step={1}
                        onChange={(e) => setBrushSize(e.target.value)}/>
                </div>

                <form className='clear-btn'>
                    <button className='button' id='clear' onClick={clearCanvas}>
                    <span><MdClear/></span>
                        Clear </button>
                </form>

                <form className='erase-btn'>
                    <button className='button' id='erase' onClick={erase}>
                    <span><FaEraser/></span>
                        Erase </button>
                </form>
                
                <form className='download-btn'>
                    <button className='button' id='download' onClick={downloadCanvas}>
                        <span><MdDownload /></span>Save</button>
                </form>
                
            </section>

        </div>
    )
}


export default Sketch