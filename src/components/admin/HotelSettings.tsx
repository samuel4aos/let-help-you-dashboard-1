import React, { useState } from 'react';
import { useHotelStore } from '@/store/useHotelStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Hotel, Mail, Phone, MapPin, Save, ShieldCheck, Layout, Image as ImageIcon, Info, Sparkles, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from './ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HotelSettings: React.FC = () => {
  const { hotelInfo, updateHotelInfo } = useHotelStore();
  const [formData, setFormData] = useState(hotelInfo);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSave = async () => {
    await updateHotelInfo(formData);
    toast.success('Hotel settings updated successfully!');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.current !== (hotelInfo.adminPassword || 'admin123')) {
      toast.error('Current password incorrect');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    await updateHotelInfo({ adminPassword: passwords.new });
    toast.success('Administrative password updated successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Management Suite</h2>
          <p className="text-slate-500">Tailor your property's digital presence and guest experience.</p>
        </div>
        <Button className="bg-slate-900 rounded-2xl px-10 h-12 shadow-lg shadow-slate-900/10" onClick={handleSave}>
          <Save className="mr-2 w-5 h-5" /> Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="bg-white border p-1 rounded-2xl shadow-sm">
          <TabsTrigger value="general" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
            <Info className="w-4 h-4 mr-2" /> General Info
          </TabsTrigger>
          <TabsTrigger value="front-page" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
            <Layout className="w-4 h-4 mr-2" /> Front Page Editor
          </TabsTrigger>
          <TabsTrigger value="experience" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
            <Sparkles className="w-4 h-4 mr-2" /> Experience Section
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">
            <Shield className="w-4 h-4 mr-2" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Hotel className="w-6 h-6 text-amber-500" /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Hotel Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => updateField('name', e.target.value)}
                    className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Mail className="w-4 h-4" /> Contact Email</Label>
                        <Input 
                            value={formData.email} 
                            onChange={(e) => updateField('email', e.target.value)}
                            className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white" 
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</Label>
                        <Input 
                            value={formData.phone} 
                            onChange={(e) => updateField('phone', e.target.value)}
                            className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white" 
                        />
                    </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Physical Address</Label>
                  <Input 
                    value={formData.address} 
                    onChange={(e) => updateField('address', e.target.value)}
                    className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-amber-50 h-fit">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2 text-amber-900">
                        <ShieldCheck className="w-6 h-6" /> Hotel Policies
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                    {formData.policies.map((policy, i) => (
                        <div key={i} className="group relative">
                            <Input 
                                value={policy}
                                onChange={(e) => {
                                    const newPolicies = [...formData.policies];
                                    newPolicies[i] = e.target.value;
                                    updateField('policies', newPolicies);
                                }}
                                className="rounded-xl bg-white border-amber-100 text-sm font-medium text-amber-900 pr-10"
                            />
                            <button 
                                onClick={() => updateField('policies', formData.policies.filter((_, idx) => idx !== i))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300 hover:text-red-500"
                            >
                                <Save className="w-4 h-4 rotate-45" />
                            </button>
                        </div>
                    ))}
                    <Button 
                        variant="outline" 
                        className="w-full rounded-xl border-amber-200 text-amber-700 hover:bg-amber-100 h-11 text-xs font-bold uppercase tracking-widest"
                        onClick={() => updateField('policies', [...formData.policies, 'New Policy'])}
                    >
                        + Add Policy
                    </Button>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="front-page">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Layout className="w-6 h-6 text-amber-500" /> Hero Section
                        </CardTitle>
                        <CardDescription>Main content guests see when they first arrive.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Hero Title</Label>
                            <Input 
                                value={formData.heroTitle} 
                                onChange={(e) => updateField('heroTitle', e.target.value)}
                                className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Hero Subtitle</Label>
                            <Textarea 
                                value={formData.heroSubtitle} 
                                onChange={(e) => updateField('heroSubtitle', e.target.value)}
                                className="rounded-2xl min-h-[100px] bg-slate-50 border-slate-100 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Hero Background Image</Label>
                            <ImageUploader 
                                images={formData.heroImage ? [formData.heroImage] : []} 
                                onChange={(imgs) => updateField('heroImage', imgs[0] || '')}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-amber-500" /> Featured Residences Intro
                        </CardTitle>
                        <CardDescription>The middle section introducing your rooms.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Section Title</Label>
                            <Input 
                                value={formData.lowerSectionTitle} 
                                onChange={(e) => updateField('lowerSectionTitle', e.target.value)}
                                className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Section Description</Label>
                            <Textarea 
                                value={formData.lowerSectionContent} 
                                onChange={(e) => updateField('lowerSectionContent', e.target.value)}
                                className="rounded-2xl min-h-[120px] bg-slate-50 border-slate-100 focus:bg-white"
                            />
                        </div>
                    </CardContent>
                </Card>
           </div>
        </TabsContent>

        <TabsContent value="experience">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-amber-500" /> Experience & Hospitality
                    </CardTitle>
                    <CardDescription>The detailed section about your hotel's values and services.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">About Title</Label>
                                <Input 
                                    value={formData.aboutTitle} 
                                    onChange={(e) => updateField('aboutTitle', e.target.value)}
                                    className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">About Description</Label>
                                <Textarea 
                                    value={formData.aboutDescription} 
                                    onChange={(e) => updateField('aboutDescription', e.target.value)}
                                    className="rounded-2xl min-h-[150px] bg-slate-50 border-slate-100 focus:bg-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Experience Image</Label>
                                <ImageUploader 
                                    images={formData.experienceImage ? [formData.experienceImage] : []} 
                                    onChange={(imgs) => updateField('experienceImage', imgs[0] || '')}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Key Highlights (Max 4)</Label>
                            {formData.experienceItems.map((item, i) => (
                                <Card key={i} className="rounded-2xl border-slate-100 bg-slate-50/50 p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase">Title</Label>
                                            <Input 
                                                value={item.title} 
                                                onChange={(e) => {
                                                    const newItems = [...formData.experienceItems];
                                                    newItems[i].title = e.target.value;
                                                    updateField('experienceItems', newItems);
                                                }}
                                                className="h-10 rounded-xl"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase">Icon Type</Label>
                                            <Input 
                                                value={item.icon} 
                                                onChange={(e) => {
                                                    const newItems = [...formData.experienceItems];
                                                    newItems[i].icon = e.target.value;
                                                    updateField('experienceItems', newItems);
                                                }}
                                                placeholder="e.g. ShieldCheck"
                                                className="h-10 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase">Description</Label>
                                        <Input 
                                            value={item.desc} 
                                            onChange={(e) => {
                                                const newItems = [...formData.experienceItems];
                                                newItems[i].desc = e.target.value;
                                                updateField('experienceItems', newItems);
                                            }}
                                            className="h-10 rounded-xl"
                                        />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Lock className="w-6 h-6 text-amber-500" /> Change Admin Password
                        </CardTitle>
                        <CardDescription>Update the administrative access password for this property.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Password</Label>
                                <Input 
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                    className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">New Password</Label>
                                <Input 
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                    className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Confirm New Password</Label>
                                <Input 
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                    className="rounded-2xl h-12 bg-slate-50 border-slate-100 focus:bg-white"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-slate-900 h-12 rounded-2xl font-bold mt-4 shadow-lg shadow-slate-900/10">
                                Update Administrative Access
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-slate-900 text-white">
                    <CardHeader className="p-8">
                        <div className="bg-amber-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck className="text-slate-900 w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-serif">Security Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6 text-slate-400">
                        <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                            <p className="text-sm">Use a strong, unique password that isn't shared with other services.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                            <p className="text-sm">Avoid using common words or predictable patterns like "password123".</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                            <p className="text-sm">Change your password periodically to maintain high security standards.</p>
                        </div>
                        <div className="pt-8 border-t border-white/10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">System Status</p>
                            <p className="text-xl font-bold text-white mt-1">Fully Encrypted</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotelSettings;