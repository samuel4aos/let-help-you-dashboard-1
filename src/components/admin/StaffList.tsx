import React from 'react';
import { useHotelStore } from '@/store/useHotelStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Mail, Phone, MoreVertical, ShieldCheck, UserCog } from 'lucide-react';
import { toast } from 'sonner';

const StaffList: React.FC = () => {
  const { staff } = useHotelStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Staff Management</h2>
          <p className="text-slate-500">Manage your hotel team and permissions.</p>
        </div>
        <Button className="bg-slate-900 rounded-xl px-6">
          <UserPlus className="mr-2 w-4 h-4" /> Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <Card key={member.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                  <p className="text-sm text-amber-600 font-medium">{member.role}</p>
                </div>
                <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="rounded-lg px-2">
                  {member.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="w-4 h-4" /> {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-green-500" /> Authorized Staff
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl h-10">
                  <UserCog className="mr-2 w-4 h-4" /> Permissions
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-50">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffList;