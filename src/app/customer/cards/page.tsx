'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockRFIDCards, mockRFIDCardBalances, formatCurrency, formatDateShort } from '@/data/mock-data';
import { useStore } from '@/store/useStore';

export default function CardsPage() {
  const customer = useStore((state) => state.customer);
  const customerCards = mockRFIDCards.filter((c) => c.customerId === customer.id);
  const activeCards = customerCards.filter((c) => c.status === 'active').length;
  const inactiveCards = customerCards.filter((c) => c.status !== 'active').length;

  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleDetail = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <MainLayout userType="customer">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Kartu RFID</h1>
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
                <p className="text-2xl font-bold text-gray-900">{customerCards.length}</p>
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
              {customerCards.map((card) => (
                <div key={card.id}>
                  <div className="flex items-center justify-between rounded-lg border p-4">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDetail(card.id)}
                      >
                        {expandedCard === card.id ? 'Tutup' : 'Detail'}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {expandedCard === card.id && (
                    <div className="ml-16 mt-2 rounded-lg border border-dashed bg-gray-50 p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Saldo Kartu</p>
                          <p className="text-lg font-bold text-pertamina-red">
                            {formatCurrency(mockRFIDCardBalances[card.id] || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="font-medium">
                            {card.status === 'active' ? 'Aktif' : card.status === 'blocked' ? 'Diblokir' : 'Tidak Aktif'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tanggal Registrasi</p>
                          <p className="font-medium">{formatDateShort(card.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Kendaraan</p>
                          <p className="font-medium">{card.vehiclePlate} ({card.vehicleType})</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}
