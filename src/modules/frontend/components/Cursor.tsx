"use client"

import { useEffect, useRef } from "react"

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let rafId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + "px"
      dot.style.top = mouseY + "px"
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12)
      ringY = lerp(ringY, mouseY, 0.12)
      ring.style.left = ringX + "px"
      ring.style.top = ringY + "px"
      rafId = requestAnimationFrame(animate)
    }

    const onEnter = () => ring.classList.add("hovering")
    const onLeave = () => ring.classList.remove("hovering")

    const interactables = () => document.querySelectorAll("a, button, [role='button'], input, select, textarea, label")
    
    const addListeners = () => {
      interactables().forEach(el => {
        el.addEventListener("mouseenter", onEnter)
        el.addEventListener("mouseleave", onLeave)
      })
    }

    document.addEventListener("mousemove", onMouseMove)
    addListeners()
    rafId = requestAnimationFrame(animate)

    // Re-bind on DOM changes
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
