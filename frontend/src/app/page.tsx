"use client"
import { useState,useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Freelancer {
  name: string;
  email: string;
  phone: string;
  expertise: string[];
  age: number;
}

export default function SearchPage() {
  const router = useRouter();
  const [load,setLoad]=useState(true)
  const [searchQuery, setSearchQuery] = useState('');
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(()=>{
          const checkReg = async (): Promise<void> => {
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/check_reg`, {
                credentials: "include"
              });
              const rd = await res.json();
              
              if (rd.success) {
                setLoad(false);
              } else {
                router.push('/login');
              }
            } catch (error) {
              console.error('Registration check failed:', error);
              router.push('/login');
            }
          };
          checkReg();
    },[])
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/findFL?skill=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if(!data.success){setFreelancers([] as Freelancer[]);return;}
      setFreelancers(data.data);
    } catch (err) {
      setError('Error fetching freelancers. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  if(load)return <></>
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Find Freelancers</h1>
        
        <div className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Enter skill (e.g., tv repair, mixer repair, ac repait)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        )}

        <div className="space-y-4">
          {freelancers.map((freelancer, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{freelancer.name}</h2>
                    <p className="text-gray-500">Age: {freelancer.age}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{freelancer.email}</p>
                    <p className="text-sm">{freelancer.phone}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {freelancer.expertise.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex}
                      variant="secondary"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {freelancers.length === 0 && !isLoading && !error && (
            <div className="text-center text-gray-500 py-8">
              No freelancers found. Try searching for a different skill.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}