'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockRFIDCards } from '@/data/mock-data';

export default function CardsPage() {
  const activeCards = mockRFIDCards.filter((c) => c.status === 'active').length;
  const inactiveCards = mockRFIDCards.filter((c) => c.status !== 'active').length;

  return (
    <MainLayout userType="customer">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kartu RFID</h1>
            <p className="text-gray-500">Kelola kartu RFID kendaraan Anda</p>
          </div>
          <Button className="bg-pertamina-red hover:bg-red-700">
            + Daftarkan Kartu Baru
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Kartu</p>
                <p className="text-2xl font-bold text-gray-900">{mockRFIDCards.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Kartu Aktif</p>
                <p className="text-2xl font-bold text-green-600">{activeCards}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-gray-400">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Tidak Aktif</p>
                <p className="text-2xl font-bold text-gray-400">{inactiveCards}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kartu RFID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRFIDCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pertamina-red text-white">
                      <span className="text-lg font-bold">RF</span>
                    </div>
                    <div>
                      <p className="font-mono font-medium text-gray-900">
                        {card.cardNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {card.vehiclePlate} - {card.vehicleType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        card.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : card.status === 'blocked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'
                      }
                    >
                      {card.status === 'active' ? 'Aktif' : card.status === 'blocked' ? 'Diblokir' : 'Tidak Aktif'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="border-dashed bg-gray-50">
          <CardContent className="py-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Catatan:</span> Setiap kartu RFID terhubung dengan 1 kendaraan. 
              Saldo deposit bersifat per akun perusahaan, bukan per kartu.
              Semua kartu dalam akun Anda menggunakan saldo deposit yang sama.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
