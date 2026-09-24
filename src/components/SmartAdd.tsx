'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from "sonner";

export function SmartAdd() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    
    try {
      const res = await fetch('/api/smart-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text,
          localDate: format(new Date(), 'yyyy-MM-dd')
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error || 'Failed to process transaction.');
        return;
      }

      toast.success('Transaction added successfully!');
      setText(''); // clear input on success
      router.refresh(); // refresh the page data
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred while analyzing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-primary">
          <Sparkles className="h-5 w-5" />
          Smart Add
        </CardTitle>
        <CardDescription>
          Type naturally what you spent or earned. E.g. &quot;Spent 500 Rs on lunch today&quot; or &quot;Got paid 25000 Rs for freelance&quot;.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter transaction naturally..."
              disabled={loading}
              className="bg-background"
            />
          </div>
          <Button type="submit" disabled={loading || !text.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? 'Analyzing...' : 'Add'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
