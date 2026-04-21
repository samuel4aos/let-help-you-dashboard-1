import React from 'react';
import { useHotelStore } from '@/store/useHotelStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Hotel, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const HotelSettings: React.FC = () => {
  const { hotelInfo, updateHotelInfo } = useHotelStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Hotel settings updated successfully!');
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hotel Configuration</h2>
          <p className="text-slate-500">Update your property details and public profile.</p>
        </div>
        <Button className="bg-slate-900 rounded-xl px-8" onClick={handleSave}>
          <Save className="mr-2 w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
                <Hotel className="w-5 h-5 text-amber-500" /> Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label>Hotel Name</Label>
              <Input defaultValue={hotelInfo.name} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Tagline / Description</Label>
              <Textarea defaultValue={hotelInfo.description} className="rounded-xl min-h-[100px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Contact Email</Label>
                    <Input defaultValue={hotelInfo.email} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</Label>
                    <Input defaultValue={hotelInfo.phone} className="rounded-xl" />
                </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Physical Address</Label>
              <Input defaultValue={hotelInfo.address} className="rounded-xl" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-amber-50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                        <ShieldCheck className="w-5 h-5" /> Policies
                    </CardTitle>
                    <CardDescription className="text-amber-700/70">Manage guest expectations and rules.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {hotelInfo.policies.map((policy, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-100 text-sm font-medium text-amber-900">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {policy}
                        </div>
                    ))}
                    <Button variant="ghost" className="w-full text-amber-700 hover:text-amber-800 hover:bg-amber-100 mt-4 text-xs font-bold uppercase tracking-wider">
                        + Add Policy
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg">Brand Logo</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-6">
                    <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
                        <Hotel className="w-12 h-12 text-amber-500" />
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg">Change Logo</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default HotelSettings;