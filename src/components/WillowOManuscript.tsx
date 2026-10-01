import React, { useState, useEffect } from 'react';
import { AestheticMode, ManuscriptNode } from '../types';
import { BookOpen, Plus, Download, FileText, CheckCircle2, Tag, Calendar, User } from 'lucide-react';

interface WillowOManuscriptProps {
  aestheticMode: AestheticMode;
  onSelectNodeForKompiler?: (node: ManuscriptNode) => void;
}

export const WillowOManuscript: React.FC<WillowOManuscriptProps> = ({
  aestheticMode,
  onSelectNodeForKompiler
}) => {
  const isAmber = aestheticMode === 'amber-gold';

  const [nodes, setNodes] = useState<ManuscriptNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<ManuscriptNode | null>(null);
  const [filterAuthor, setFilterAuthor] = useState<string>('ALL');
  const [isAdding, setIsAdding] = useState(false);

  // New chapter fields
  const [newTitle, setNewTitle] = useState('');
  const [newProse, setNewProse] = useState('');
  const [newAuthor, setNewAuthor] = useState<'April Rose' | 'Mystivia' | 'Nyptix' | 'Kat (Yuba City)'>('April Rose');
  const [newTags, setNewTags] = useState('Sovereign, PrimeBus, Yuba City');

  const fetchManuscript = async () => {
    try {
      const res = await fetch('/api/katz/willow-manuscript');
      if (res.ok) {
        const data = await res.json();
        setNodes(data.nodes || []);
        if (data.nodes?.length > 0 && !selectedNode) {
          setSelectedNode(data.nodes[0]);
        }
      }
    } catch (err) {
      console.error('Fetch manuscript error:', err);
    }
  };

  useEffect(() => {
    fetchManuscript();
  }, []);

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProse.trim()) return;

    try {
      const res = await fetch('/api/katz/willow-manuscript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          prose: newProse,
          authorAlias: newAuthor,
          tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setNewTitle('');
        setNewProse('');
        setIsAdding(false);
        fetchManuscript();
        setSelectedNode(data.node);
      }
    } catch (err) {
      console.error('Add chapter error:', err);
    }
  };

  const handleExportMarkdown = () => {
    const md = nodes.map(n => 
      `# Chapter ${n.chapterNumber}: ${n.title}\n**Author**: ${n.authorAlias} | **WAL Page**: ${n.walPageId} | **Committed**: ${n.committedAt}\n\n${n.prose}\n\n---\n`
    ).join('\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Willow_O_Manuscript_WAL_Archive_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredNodes = filterAuthor === 'ALL'
    ? nodes
    : nodes.filter(n => n.authorAlias === filterAuthor);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[760px] font-mono text-xs">
      {/* Left Column: Chapters Index */}
      <div className={`lg:col-span-1 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden ${
        isAmber ? 'bg-[#120d04]/80 border-[#FFBF00]/30' : 'bg-[#100318]/80 border-[#FF00FF]/30'
      }`}>
        {/* Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white tracking-wide">
              WILLOW-O WAL MANUSCRIPT
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className={`p-1 rounded text-[11px] font-bold cursor-pointer transition-all ${
                isAmber ? 'bg-[#FFBF00] text-black hover:bg-amber-400' : 'bg-[#00FFFF] text-black hover:bg-cyan-300'
              }`}
              title="Add narrative node"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleExportMarkdown}
              className="p-1 rounded text-[11px] bg-white/10 hover:bg-white/20 text-gray-200 cursor-pointer"
              title="Export as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-3 py-2 border-b border-white/10 bg-black/20 flex gap-1 overflow-x-auto text-[10px]">
          {['ALL', 'April Rose', 'Mystivia', 'Nyptix', 'Kat (Yuba City)'].map((author) => (
            <button
              key={author}
              onClick={() => setFilterAuthor(author)}
              className={`px-2 py-0.5 rounded whitespace-nowrap cursor-pointer transition-all ${
                filterAuthor === author
                  ? isAmber ? 'bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/40' : 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {author}
            </button>
          ))}
        </div>

        {/* Nodes List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? isAmber
                      ? 'bg-[#FFBF00]/20 border-[#FFBF00] text-amber-200 shadow-[0_0_10px_rgba(255,191,0,0.2)]'
                      : 'bg-[#00FFFF]/20 border-[#00FFFF] text-cyan-200 shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] mb-1 font-bold">
                  <span className="text-amber-300">Chapter {node.chapterNumber}</span>
                  <span className="text-gray-400">{node.walPageId}</span>
                </div>
                <h4 className="font-bold text-white/90 text-xs mb-1 truncate">{node.title}</h4>
                <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{node.prose}</p>

                <div className="mt-2 flex items-center justify-between text-[9px] text-gray-400 pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1 text-pink-300">
                    <User className="w-2.5 h-2.5" />
                    {node.authorAlias}
                  </span>
                  <span>{node.committedAt.substring(0, 10)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 2 Columns: Chapter Reader & New Chapter Composer */}
      <div className={`lg:col-span-2 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden ${
        isAmber ? 'bg-[#0d0903]/85 border-[#FFBF00]/30' : 'bg-[#080210]/85 border-[#FF00FF]/30'
      }`}>
        {isAdding ? (
          <form onSubmit={handleAddChapter} className="p-6 flex flex-col gap-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="font-bold text-sm text-white">Append New Chapter to SQLite WAL</span>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)} 
                className="text-gray-400 hover:text-white"
              >
                ✕ Cancel
              </button>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Chapter Title:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. The Amber Luminescence of Sutter Buttes..."
                className="w-full bg-black/60 border border-white/20 rounded px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 block mb-1">Author Alias:</label>
                <select
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value as any)}
                  className="w-full bg-black/60 border border-white/20 rounded px-2.5 py-1.5 text-white"
                >
                  <option value="April Rose">April Rose (120 BPM Melodic House)</option>
                  <option value="Mystivia">Mystivia (Cosmic Synthesizer)</option>
                  <option value="Nyptix">Nyptix (135 BPM Industrial Drive)</option>
                  <option value="Kat (Yuba City)">Kat (Yuba City Core Co-Creator)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Tags (comma-separated):</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded px-2.5 py-1.5 text-white"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-gray-400 block mb-1">Prose Body:</label>
              <textarea
                value={newProse}
                onChange={(e) => setNewProse(e.target.value)}
                placeholder="Write the living manuscript prose node..."
                className="w-full flex-1 bg-black/60 border border-white/20 rounded p-3 text-white focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className={`py-2.5 rounded-lg font-bold cursor-pointer transition-all ${
                isAmber ? 'bg-[#FFBF00] text-black hover:bg-amber-400' : 'bg-[#00FFFF] text-black hover:bg-cyan-300'
              }`}
            >
              Commit to SQLite WAL Archive
            </button>
          </form>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Chapter Header */}
            <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                    Chapter {selectedNode?.chapterNumber}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-pink-300 font-semibold">{selectedNode?.authorAlias}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400">{selectedNode?.committedAt}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{selectedNode?.title}</h2>
              </div>

              {selectedNode && onSelectNodeForKompiler && (
                <button
                  onClick={() => onSelectNodeForKompiler(selectedNode)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer transition-all ${
                    isAmber ? 'bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/40 hover:bg-[#FFBF00]/30' : 'bg-[#00FFFF]/20 text-[#00FFFF] border border-[#00FFFF]/40 hover:bg-[#00FFFF]/30'
                  }`}
                >
                  Kompiler Build →
                </button>
              )}
            </div>

            {/* Prose Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="p-6 rounded-xl bg-black/50 border border-white/10 shadow-inner">
                <p className="text-sm text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedNode?.prose}
                </p>
              </div>

              {/* Tags & WAL Page Details */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 text-[10px] text-gray-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-cyan-400" />
                  {selectedNode?.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Committed in SQLite WAL: {selectedNode?.walPageId}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
