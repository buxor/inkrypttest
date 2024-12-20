import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import InscriptionStatus from '@/components/InscriptionStatus';

interface Draft {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface Post extends Draft {
  address: string;
}

const AccountPage = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [ongoingInscriptions, setOngoingInscriptions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
      // Fetch published posts from localStorage (this should be replaced with actual API call in the future)
      const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const userPosts = allPosts.filter((post: Post) => post.address === storedAddress);
      setPublishedPosts(userPosts);
      // Fetch drafts from localStorage
      const allDrafts = JSON.parse(localStorage.getItem('drafts') || '[]');
      const userDrafts = allDrafts.filter((draft: Draft & { address: string }) => draft.address === storedAddress);
      setDrafts(userDrafts);

      // Fetch ongoing inscriptions
      const inscriptions = JSON.parse(localStorage.getItem('ongoingInscriptions') || '[]');
      setOngoingInscriptions(inscriptions.filter((inscription: any) => inscription.address === storedAddress));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleEditDraft = (draft: Draft) => {
    navigate('/editor', { state: { draft } });
  };

  const handleDeleteDraft = (id: string) => {
    const allDrafts = JSON.parse(localStorage.getItem('drafts') || '[]');
    const updatedAllDrafts = allDrafts.filter((draft: Draft & { address: string }) => !(draft.id === id && draft.address === address));
    localStorage.setItem('drafts', JSON.stringify(updatedAllDrafts));
    
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    setDrafts(updatedDrafts);
  };

  const handleNewInkrypt = () => {
    navigate('/editor');
  };

  if (!address) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Account</h1>
        {address && (
          <p className="text-lg mb-8">
            Connected Address: {address}
          </p>
        )}
        
        {ongoingInscriptions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Ongoing Inscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingInscriptions.map((inscription) => (
                <InscriptionStatus key={inscription.orderId} inscription={inscription} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Drafts</h2>
            <Button onClick={handleNewInkrypt} variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> New Inkrypt
            </Button>
          </div>
          {drafts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {drafts.map((draft) => (
                <Card key={draft.id}>
                  <CardHeader>
                    <CardTitle>{draft.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Last edited on {new Date(draft.date).toLocaleDateString()}</p>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleEditDraft(draft)} variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your draft.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteDraft(draft.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>You don't have any drafts.</p>
          )}
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Inkrypted Posts</h2>
          {publishedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publishedPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Published on {new Date(post.date).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>You haven't published any posts yet.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
