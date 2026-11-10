export interface CategoryType {
  id: string;
  categoryCode: string;
  categoryName: string;
  description: string;
  displayOrder: number;
}

export interface QuestionType {
  id: string;
  questionCode: string;
  categoryId: string;
  questionText: string;
  questionOrder: number;
  category?: CategoryType;
}

export interface ParticipantType {
  id: string;
  roomId: string;
  displayName: string;
  email?: string | null;
  role: 'participant_a' | 'participant_b';
  completionStatus: 'not_started' | 'in_progress' | 'completed';
  currentQuestionIndex: number;
  consentToSharedReport: boolean;
  completedAt?: string | null;
}

export interface CoupleRoomType {
  id: string;
  roomCode: string;
  status: 'active' | 'expired';
  assessmentStatus: 'waiting_partner' | 'in_progress' | 'completed';
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
  participants: ParticipantType[];
}

export interface AnswerPayload {
  accessToken: string;
  questionId: string;
  answerValue: number;
}

export interface PaymentCreationResponse {
  paymentId: string;
  transactionId: string;
  amount: number;
  currency: string;
  gateway: 'midtrans' | 'xendit' | 'simulator';
  snapToken?: string;
  redirectUrl?: string;
  isSimulator?: boolean;
}
