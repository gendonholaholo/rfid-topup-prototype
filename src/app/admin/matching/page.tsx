'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { formatCurrency, formatDate } from '@/data/mock-data';
import { runMatchingEngine } from '@/lib/engine/matching-engine';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  GitCompare,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  FileText,
  Building2,
} from 'lucide-react';

export default function MatchingPage() {
  const webreportSubmissions = useStore((state) => state.webreportSubmissions);
  const bankStatements = useStore((state) => state.bankStatements);
  const matchingResults = useStore((state) => state.matchingResults);
  const addMatchingResult = useStore((state) => state.addMatchingResult);
  const updateMatchingStatus = useStore((state) => state.updateMatchingStatus);
  const updateWebreportStatus = useStore((state) => state.updateWebreportStatus);
  const updateBankStatementStatus = useStore((state) => state.updateBankStatementStatus);
  const addTransaction = useStore((state) => state.addTransaction);
  const updateCustomerBalance = useStore((state) => state.updateCustomerBalance);

  const [isRunning, setIsRunning] = useState(false);
  const [lastRunResult, setLastRunResult] = useState<{
    matched: number;
    unmatched: number;
  } | null>(null);

  const pendingWebreports = webreportSubmissions.filter((w) => w.status === 'pending');
  const pendingBankStatements = bankStatements.filter((b) => b.status === 'pending');
  const pendingMatches = matchingResults.filter(
    (m) => m.status === 'auto_matched' || m.status === 'manual_review'
  );
  const verifiedMatches = matchingResults.filter((m) => m.status === 'verified');
  const rejectedMatches = matchingResults.filter((m) => m.status === 'rejected');

  const handleRunMatching = async () => {
    setIsRunning(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = runMatchingEngine(webreportSubmissions, bankStatements);

    // Add matching results to store
    for (const match of result.matched) {
      addMatchingResult(match);
      updateWebreportStatus(match.webreportId, 'matched', match.bankStatementId);
      updateBankStatementStatus(match.bankStatementId, 'matched', match.webreportId);
    }

    setLastRunResult({
      matched: result.matched.length,
      unmatched: result.unmatchedWebreports.length + result.unmatchedBankStatements.length,
    });
    setIsRunning(false);
  };

  const handleVerify = (matchId: string) => {
    const match = matchingResults.find((m) => m.id === matchId);
    if (!match) return;

    updateMatchingStatus(matchId, 'verified', 'Admin');
    updateWebreportStatus(match.webreportId, 'verified');
    updateBankStatementStatus(match.bankStatementId, 'processed');

    // Create transaction and update balance
    addTransaction({
      customerId: match.webreport.customerId,
      customerName: match.webreport.customerName,
      virtualAccountNumber: match.webreport.virtualAccountNumber,
      amount: match.webreport.amount,
      status: 'success',
      paymentMethod: 'Virtual Account',
      bankCode: match.bankStatement.bankCode,
      matchingResultId: matchId,
      webreportId: match.webreportId,
      bankStatementId: match.bankStatementId,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Admin',
    });

    updateCustomerBalance(match.webreport.customerId, match.webreport.amount);
  };

  const handleReject = (matchId: string) => {
    const match = matchingResults.find((m) => m.id === matchId);
    if (!match) return;

    updateMatchingStatus(matchId, 'rejected', 'Admin', 'Ditolak oleh admin');
    updateWebreportStatus(match.webreportId, 'rejected');
    updateBankStatementStatus(match.bankStatementId, 'pending');
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-500">{score}%</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-500">{score}%</Badge>;
    return <Badge variant="destructive">{score}%</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'auto_matched':
        return <Badge className="bg-green-500 gap-1"><CheckCircle2 className="h-3 w-3" />Auto Match</Badge>;
      case 'manual_review':
        return <Badge className="bg-yellow-500 gap-1"><AlertCircle className="h-3 w-3" />Review</Badge>;
      case 'verified':
        return <Badge className="bg-blue-500 gap-1"><CheckCircle2 className="h-3 w-3" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Matching Engine</h1>
          <p className="text-muted-foreground">
            Cocokkan data Webreport dengan Rekening Koran
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingWebreports.length}</p>
                  <p className="text-sm text-muted-foreground">Webreport Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingBankStatements.length}</p>
                  <p className="text-sm text-muted-foreground">Bank Statement Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingMatches.length}</p>
                  <p className="text-sm text-muted-foreground">Perlu Verifikasi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{verifiedMatches.length}</p>
                  <p className="text-sm text-muted-foreground">Terverifikasi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Run Matching Engine */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Jalankan Matching Engine
            </CardTitle>
            <CardDescription>
              Cocokkan data Webreport dengan Bank Statement secara otomatis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleRunMatching}
                disabled={isRunning || (pendingWebreports.length === 0 && pendingBankStatements.length === 0)}
                size="lg"
              >
                {isRunning ? (
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Play className="mr-2 h-5 w-5" />
                )}
                {isRunning ? 'Mencocokkan...' : 'Jalankan Matching'}
              </Button>

              {lastRunResult && (
                <div className="text-sm">
                  <span className="text-green-600 font-medium">
                    {lastRunResult.matched} matched
                  </span>
                  {lastRunResult.unmatched > 0 && (
                    <span className="text-muted-foreground ml-2">
                      ({lastRunResult.unmatched} unmatched)
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {pendingWebreports.length} Webreport
              </div>
              <ArrowRight className="h-4 w-4" />
              <div className="flex items-center gap-1">
                <GitCompare className="h-4 w-4" />
                Engine
              </div>
              <ArrowRight className="h-4 w-4" />
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {pendingBankStatements.length} Bank Statement
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matching Results Tabs */}
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingMatches.length})
            </TabsTrigger>
            <TabsTrigger value="verified" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Verified ({verifiedMatches.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejected ({rejectedMatches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Menunggu Verifikasi</CardTitle>
                <CardDescription>
                  Hasil matching yang perlu diverifikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingMatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Tidak ada data pending</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingMatches.map((match) => (
                      <div key={match.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {getStatusBadge(match.status)}
                            {getScoreBadge(match.matchScore)}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleReject(match.id)}>
                              <XCircle className="mr-1 h-4 w-4" />
                              Tolak
                            </Button>
                            <Button size="sm" onClick={() => handleVerify(match.id)}>
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Verifikasi
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                            <p className="text-xs font-medium text-blue-600 mb-2">WEBREPORT</p>
                            <p className="font-mono text-sm">{match.webreport.virtualAccountNumber}</p>
                            <p className="font-bold">{formatCurrency(match.webreport.amount)}</p>
                            <p className="text-sm text-muted-foreground">{match.webreport.customerName}</p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                            <p className="text-xs font-medium text-purple-600 mb-2">BANK STATEMENT</p>
                            <p className="font-mono text-sm">{match.bankStatement.virtualAccountNumber}</p>
                            <p className="font-bold">{formatCurrency(match.bankStatement.amount)}</p>
                            <p className="text-sm text-muted-foreground">{match.bankStatement.bankCode}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                          <span>VA: {match.matchDetails.vaMatch ? '✓' : '✗'}</span>
                          <span>Amount: {match.matchDetails.amountMatch ? '✓' : '✗'}</span>
                          <span>Time diff: {match.matchDetails.dateProximity.toFixed(1)}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verified">
            <Card>
              <CardHeader>
                <CardTitle>Terverifikasi</CardTitle>
              </CardHeader>
              <CardContent>
                {verifiedMatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada data terverifikasi</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>VA</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                        <TableHead>Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {verifiedMatches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>{formatDate(match.verifiedAt || match.createdAt)}</TableCell>
                          <TableCell>{match.webreport.customerName}</TableCell>
                          <TableCell className="font-mono text-sm">{match.webreport.virtualAccountNumber}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(match.webreport.amount)}</TableCell>
                          <TableCell>{getScoreBadge(match.matchScore)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Ditolak</CardTitle>
              </CardHeader>
              <CardContent>
                {rejectedMatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada data ditolak</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                        <TableHead>Catatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedMatches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>{formatDate(match.updatedAt)}</TableCell>
                          <TableCell>{match.webreport.customerName}</TableCell>
                          <TableCell className="text-right">{formatCurrency(match.webreport.amount)}</TableCell>
                          <TableCell>{match.notes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
