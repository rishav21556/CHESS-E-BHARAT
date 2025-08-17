"use client"
import { AuthGuard } from "@/components/auth-guard"
import { GameContent } from "./game-content"

export default function GamePage() {
  return (
    <AuthGuard>
      <GameContent />
    </AuthGuard>
  )
}

// GameContent component can be defined here if needed
// function GameContent() {
//   const [chatInput, setChatInput] = useState("")
//   const [messages, setMessages] = useState([
//     { sender: "Opponent", text: "Good luck!" },
//     { sender: "You", text: "You too!" },
//   ])
//   const [activeTab, setActiveTab] = useState("chat")

//   const handleSendMessage = () => {
//     if (chatInput.trim()) {
//       setMessages([...messages, { sender: "You", text: chatInput.trim() }])
//       setChatInput("")
//     }
//   }

//   const handleMove = (from: [number, number], to: [number, number]) => {
//     console.log(`Move from ${from} to ${to}`)
//     // Here you would implement the actual move logic
//   }

//   return (
//     <>
//       <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="mr-2 h-4" />
//         <div className="flex items-center gap-2 font-semibold">
//           <Swords className="h-6 w-6" />
//           <span className="text-lg">Live Game</span>
//         </div>
//         <div className="ml-auto flex items-center gap-2">
//           <Button variant="outline" size="sm">
//             <RefreshCcw className="mr-2 h-4 w-4" />
//             Rematch
//           </Button>
//           <Button variant="outline" size="sm">
//             <Share2 className="mr-2 h-4 w-4" />
//             Share
//           </Button>
//           <Button variant="destructive" size="sm">
//             <X className="mr-2 h-4 w-4" />
//             Resign
//           </Button>
//           <ThemeToggle />
//         </div>
//       </header>

//       <div className="flex flex-col p-2 gap-2 h-[calc(100vh-4rem)] overflow-hidden">
//         {/* Top Section: Chess Board + Player Info Side by Side */}
//         <div className="flex gap-4 justify-center">
//           {/* Chess Board */}
//           <div className="flex items-center justify-center">
//             <ChessBoard onMove={handleMove} />
//           </div>

//           {/* Player Info - Right side of chessboard */}
//           <div className="flex flex-col justify-center gap-4 w-64">
//             {/* Opponent Info */}
//             <Card className="shrink-0">
//               <CardContent className="flex flex-col items-center justify-center p-3 text-center">
//                 <Avatar className="h-8 w-8 mb-2">
//                   <AvatarImage src="/placeholder-user.jpg" alt="Opponent" />
//                   <AvatarFallback className="text-xs">OP</AvatarFallback>
//                 </Avatar>
//                 <div className="text-sm font-medium">Opponent (1850)</div>
//                 <div className="text-xs text-muted-foreground mb-2">Black</div>
//                 <div className="text-xl font-bold">09:45</div>
//               </CardContent>
//             </Card>

//             {/* Your Info */}
//             <Card className="shrink-0">
//               <CardContent className="flex flex-col items-center justify-center p-3 text-center">
//                 <Avatar className="h-8 w-8 mb-2">
//                   <AvatarImage src="/placeholder-user.jpg" alt="You" />
//                   <AvatarFallback className="text-xs">YO</AvatarFallback>
//                 </Avatar>
//                 <div className="text-sm font-medium">You (1720)</div>
//                 <div className="text-xs text-muted-foreground mb-2">White</div>
//                 <div className="text-xl font-bold">09:52</div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Bottom Section: Chat/Coach and Move History */}
//         <div className="flex gap-4 flex-1 min-h-0 justify-center">
//           {/* Chat/Coach Section */}
//           <Card className="flex-1 flex flex-col min-h-0 max-w-md">
//             <CardHeader className="shrink-0 pb-2">
//               <div className="grid grid-cols-2 gap-2">
//                 <Button
//                   variant={activeTab === "chat" ? "default" : "outline"}
//                   onClick={() => setActiveTab("chat")}
//                   size="sm"
//                 >
//                   <MessageSquare className="mr-2 h-4 w-4" /> Chat
//                 </Button>
//                 <Button
//                   variant={activeTab === "coach" ? "default" : "outline"}
//                   onClick={() => setActiveTab("coach")}
//                   size="sm"
//                 >
//                   <Crown className="mr-2 h-4 w-4" /> Coach
//                 </Button>
//               </div>
//             </CardHeader>
//             <Separator className="shrink-0" />
//             {activeTab === "chat" ? (
//               <CardContent className="flex flex-1 flex-col p-3 min-h-0">
//                 <div className="flex-1 overflow-y-auto text-sm space-y-1">
//                   {messages.map((msg, index) => (
//                     <div key={index} className="text-xs">
//                       <span className="font-semibold">{msg.sender}:</span> {msg.text}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-2 flex gap-2 shrink-0">
//                   <Input
//                     placeholder="Type message..."
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter") {
//                         handleSendMessage()
//                       }
//                     }}
//                     className="text-sm"
//                     size={undefined}
//                   />
//                   <Button size="sm" onClick={handleSendMessage}>
//                     <ArrowUp className="h-3 w-3" />
//                   </Button>
//                 </div>
//               </CardContent>
//             ) : (
//               <CardContent className="flex flex-1 flex-col p-3 min-h-0">
//                 <div className="flex-1 overflow-y-auto text-xs">
//                   <h4 className="mb-2 font-semibold">Bot Coach:</h4>
//                   <div className="rounded-md bg-muted p-2 mb-2">
//                     <p className="font-medium text-xs">Current Suggestion:</p>
//                     <p className="text-xs text-muted-foreground">Consider Nf3 to control center.</p>
//                   </div>
//                   <div className="rounded-md bg-muted p-2">
//                     <p className="font-medium text-xs">Last Move (e4):</p>
//                     <p className="text-xs text-muted-foreground">Good opening move.</p>
//                   </div>
//                 </div>
//               </CardContent>
//             )}
//           </Card>

//           {/* Move History */}
//           <Card className="flex-1 flex flex-col min-h-0 max-w-md">
//             <CardHeader className="shrink-0 pb-2">
//               <CardTitle className="text-sm">Move History</CardTitle>
//               <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
//                 <div className="text-center font-medium">White</div>
//                 <div className="text-center font-medium">Black</div>
//               </div>
//             </CardHeader>
//             <Separator className="shrink-0" />
//             <CardContent className="flex-1 overflow-y-auto text-xs p-3 min-h-0">
//               <div className="grid grid-cols-2 gap-x-4 gap-y-1">
//                 <div className="font-semibold">1. e4</div>
//                 <div className="font-semibold">e5</div>
//                 <div>2. Nf3</div>
//                 <div>Nc6</div>
//                 <div>3. Bb5</div>
//                 <div>a6</div>
//                 <div>4. Ba4</div>
//                 <div>Nf6</div>
//                 <div>5. O-O</div>
//                 <div>Be7</div>
//                 <div>6. Re1</div>
//                 <div>b5</div>
//                 <div>7. Bb3</div>
//                 <div>d6</div>
//                 <div>8. c3</div>
//                 <div>O-O</div>
//                 <div>9. h3</div>
//                 <div>Na5</div>
//                 <div>10. Bc2</div>
//                 <div>c5</div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   )
// }
