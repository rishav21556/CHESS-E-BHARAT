"use client"
import Image from "next/image"
import type React from "react"

import { useState } from "react"

type Piece = "wp" | "wr" | "wn" | "wb" | "wq" | "wk" | "bp" | "br" | "bn" | "bb" | "bq" | "bk" | ""

interface ChessBoardProps {
  boardState?: Piece[][]
  onMove?: (from: [number, number], to: [number, number]) => void
}

const pieceImages: Record<Piece, string> = {
  wp: "/pieces/wp.png",
  wr: "/pieces/wr.png",
  wn: "/pieces/wn.png",
  wb: "/pieces/wb.png",
  wq: "/pieces/wq.png",
  wk: "/pieces/wk.png",
  bp: "/pieces/bp.png",
  br: "/pieces/br.png",
  bn: "/pieces/bn.png",
  bb: "/pieces/bb.png",
  bq: "/pieces/bq.png",
  bk: "/pieces/bk.png",
  "": "",
}

const initialBoardState: Piece[][] = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
]

export function ChessBoard({ boardState = initialBoardState, onMove }: ChessBoardProps) {
  const [draggedPiece, setDraggedPiece] = useState<{ piece: Piece; from: [number, number] } | null>(null)
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)

  const handleDragStart = (e: React.DragEvent, piece: Piece, row: number, col: number) => {
    if (piece) {
      setDraggedPiece({ piece, from: [row, col] })
      e.dataTransfer.effectAllowed = "move"
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()
    if (draggedPiece && onMove) {
      onMove(draggedPiece.from, [row, col])
    }
    setDraggedPiece(null)
  }

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      if (onMove && (selectedSquare[0] !== row || selectedSquare[1] !== col)) {
        onMove(selectedSquare, [row, col])
      }
      setSelectedSquare(null)
    } else if (boardState[row][col]) {
      setSelectedSquare([row, col])
    }
  }

  return (
    <div className="grid aspect-square w-full max-w-[500px] grid-cols-8 grid-rows-8 border-2 border-gray-700 shadow-lg">
      {boardState.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isLightSquare = (rowIndex + colIndex) % 2 === 0
          const bgColor = isLightSquare ? "bg-[#ebecd0]" : "bg-[#779556]"
          const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex
          const pieceSrc = pieceImages[piece]

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`relative flex items-center justify-center ${bgColor} ${
                isSelected ? "ring-2 ring-blue-500" : ""
              } cursor-pointer`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {pieceSrc && (
                <Image
                  src={pieceSrc || "/placeholder.svg"}
                  alt={piece}
                  width={50}
                  height={50}
                  className="h-full w-full object-contain p-1 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, piece, rowIndex, colIndex)}
                />
              )}
            </div>
          )
        }),
      )}
    </div>
  )
}
