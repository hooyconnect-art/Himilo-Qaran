
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Role, WorkflowStatus, Idea, User, AuditEntry, AppView, MembershipStatus, MembershipType, 
  ElectionStatus, CandidateStatus, JobPosition, ElectionEvent, CandidateRecord, 
  JobCategory, VotingMethod, ReviewAction, TeamProposal, CouncilOpinion
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import AdminUserManagement from './components/AdminUserManagement';
import AdminPolicyDevelopment from './components/AdminPolicyDevelopment';
import GovernanceRegistry from './components/GovernanceRegistry';
import AdminCommittees from './components/AdminCommittees';
import AdminElections from './components/AdminElections';
import AdminCandidates from './components/AdminCandidates';
import AdminJobs from './components/AdminJobs';
import AuditLog from './components/AuditLog';
import InstitutionalMemory from './components/InstitutionalMemory';
import VotingTerminal from './components/VotingTerminal';
import ElectionResults from './components/ElectionResults';
import JobRegistration from './components/JobRegistration';
import MemberIdeaSubmission from './components/MemberIdeaSubmission';
import GovernanceAssistant from './components/GovernanceAssistant';

// STAGE IMPORTS
import SubmissionPage from './components/governance/SubmissionPage';
import FilteringPage from './components/governance/FilteringPage';
import SynthesisPage from './components/governance/SynthesisPage';
import FinalGuardPage from './components/governance/FinalGuardPage';
import ExecutionPage from './components/governance/ExecutionPage';

// NEW ACTIVATION IMPORTS
import TeamProposalForm from './components/activation/TeamProposalForm';
import CouncilOpinionHub from './components/review/CouncilOpinionHub';
import ActivationOversightHub from './components/oversight/ActivationOversightHub';

const INITIAL_USERS: User[] = [
  { id: 'u-mustaf', name: 'Mustaf Superadmin', email: 'mustaf@himiloqaran.so', password: 'admin1010', role: Role.SUPER_ADMIN, region: 'Banaadir', district: 'Hodan', gender: 'Male', birthDate: '1985-01-01', status: MembershipStatus.LA_ANSIXIYAY, membershipType: MembershipType.PROFESSIONAL, participationScore: 100, phone: '0615550000', nationalId: 'HQ-999999', createdAt: new Date().toISOString() },
];

const INITIAL_JOBS: JobPosition[] = [
  { 
    id: 'j1', 
    jobCode: 'HQ-PR-01', 
    title: 'Guddoomiyaha Warbaahinta', 
    committeeId: 'c1',
    category: JobCategory.HOGGAAN, 
    level: 'Qaran', 
    termMonths: 36, 
    termLimit: 2, 
    youthQuota: false, 
    votingMethod: VotingMethod.DIRECT, 
    kpis: ['Engagement Rate', 'Public Trust'],
    status: 'ACTIVE',
    requirements: { membershipType: MembershipType.PROFESSIONAL, status: MembershipStatus.LA_ANSIXIYAY }
  },
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [elections, setElections] = useState<ElectionEvent[]>([]);
  const [jobs, setJobs] = useState<JobPosition[]>(INITIAL_JOBS);
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [votes, setVotes] = useState<any[]>([]);

  // ACTIVATION STATE
  const [teamProposals, setTeamProposals] = useState<TeamProposal[]>([]);
  const [councilOpinions, setCouncilOpinions] = useState<CouncilOpinion[]>([]);

  const logAction = useCallback((action: string, details: string, entityId?: string, actor?: User) => {
    const actingUser = actor || currentUser;
    if (!actingUser) return;
    const newEntry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      actorId: actingUser.id,
      actorName: actingUser.name,
      actorRole: actingUser.role,
      action,
      details,
      affectedEntityId: entityId
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setView('dashboard');
    logAction('USER_LOGIN', `Xubinta ${user.name} ayaa gashay nidaamka.`);
  };

  const handleSignup = (userData: Partial<User>) => {
    const newUser: User = {
      ...userData,
      id: `u${Date.now()}`,
      role: Role.XUBIN,
      status: MembershipStatus.SUGITAAN,
      membershipType: MembershipType.GUUD,
      participationScore: 0,
      createdAt: new Date().toISOString(),
    } as User;

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setView('dashboard');
    logAction('USER_CREATED', `Xubin cusub ayaa is-diiwaangelisay: ${newUser.name}`, newUser.id, newUser);
  };

  const handleLogout = () => {
    logAction('USER_LOGOUT', `Xubinta ${currentUser?.name} ayaa ka baxday nidaamka.`);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setView('dashboard');
  };

  const handleAddJob = (job: JobPosition) => {
    setJobs(prev => [...prev, job]);
    logAction('JOB_CREATED', `Blueprint shaqo oo cusub ayaa la qeexay: ${job.title}`, job.id);
  };

  const handleSubmitTeamProposal = (proposal: TeamProposal) => {
    setTeamProposals(prev => [...prev, { ...proposal, status: 'PENDING_OVERSIGHT' }]);
    logAction('TEAM_SUBMITTED', `Guddoomiye ${proposal.chairpersonName} ayaa gudbiyay kooxdiisa xulashada ah.`, proposal.id);
    
    // Log individual member assignments
    proposal.members.forEach(m => {
      logAction('MEMBER_ASSIGNED_TO_JOB', `Xubinta ${m.memberName} waxaa loo xulay shaqada ID: ${m.jobId}`, m.memberId);
    });

    setView('dashboard');
  };

  const handleOversightDecision = (proposalId: string, status: TeamProposal['status'], notes: string) => {
    setTeamProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status } : p));
    logAction('OVERSIGHT_DECISION', `Guddiga Kormeerka ayaa gaaray go'aan: ${status}. Notes: ${notes}`, proposalId);
    
    if (status === 'APPROVED') {
      const proposal = teamProposals.find(p => p.id === proposalId);
      if (proposal) {
        // Activate Chairperson
        setUsers(prev => prev.map(u => u.id === proposal.chairpersonId ? { ...u, role: Role.CHAIRPERSON_ACTIVE } : u));
        logAction('CHAIRPERSON_ACTIVATED', `Guddoomiyaha ${proposal.chairpersonName} waa ACTIVE.`, proposal.chairpersonId);
        
        // Update assigned members roles to ACTIVE (COMMITTEE_MEMBER)
        proposal.members.forEach(m => {
          setUsers(prev => prev.map(u => u.id === m.memberId ? { ...u, role: Role.COMMITTEE_MEMBER } : u));
        });

        logAction('OVERSIGHT_APPROVED', `Kooxda guddiga ${proposal.committeeId} waa la ansixiyay.`, proposal.id);
        
        if (currentUser?.id === proposal.chairpersonId) {
          setCurrentUser(prev => prev ? { ...prev, role: Role.CHAIRPERSON_ACTIVE } : null);
        }
      }
    } else if (status === 'RETURNED') {
      logAction('OVERSIGHT_RETURNED', `Qorshaha kooxda waa la soo celiyay si dib u eegis loogu sameeyo.`, proposalId);
    }
  };

  // Rest of the application logic remains identical...
  const handleAddIdea = (data: Partial<Idea>) => {
    if (!currentUser) return;
    const newIdea: Idea = {
      id: `idea_${Date.now()}`,
      title: data.title || 'Untitled',
      description: data.description || '',
      authorId: currentUser.id,
      authorName: currentUser.name,
      status: WorkflowStatus.SUBMITTED,
      createdAt: new Date().toISOString(),
      category: data.category || 'General',
      version: 1,
      reviewHistory: [],
    };
    setIdeas(prev => [...prev, newIdea]);
    logAction('IDEA_SUBMITTED', `Fikrad cusub: ${newIdea.title}`, newIdea.id);
  };

  const handleEnterStage = (id: string, stageView: AppView) => {
    setActiveIdeaId(id);
    setView(stageView);
  };

  const updateIdeaState = (id: string, status: WorkflowStatus, action: ReviewAction, synthesisVotes?: any) => {
    setIdeas(prev => prev.map(i => i.id === id ? { 
      ...i, 
      status, 
      reviewHistory: [...i.reviewHistory, action],
      synthesisVotes: synthesisVotes || i.synthesisVotes
    } : i));
    logAction('IDEA_MOVED', `Fikradda ${id} waxaa loo wareejiyay: ${status}`, id);
    setView('admin-policy');
  };

  const activeIdea = useMemo(() => ideas.find(i => i.id === activeIdeaId), [ideas, activeIdeaId]);

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} onSignup={handleSignup} availableUsers={users} />;
  }

  return (
    <div className="flex min-h-screen bg-hq-white font-sans antialiased text-hq-black">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        userRole={currentUser!.role} 
        elections={elections} 
        currentUser={currentUser!} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          user={currentUser!} 
          health={{participationRate: 88, captureRisk: 'Low', regionalBalance: 92, unresolvedGrievances: 0}} 
          onRoleSwitch={() => {}}
          onLogout={handleLogout}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
          {view === 'dashboard' && (
            <Dashboard 
              health={{participationRate: 88, captureRisk: 'Low', regionalBalance: 92, unresolvedGrievances: 0}} 
              ideas={ideas} 
              usersCount={users.length} 
              onNavigate={setView} 
              currentUser={currentUser!}
              auditLogs={auditLogs} // Passed for real-time visual feed
            />
          )}
          
          {view === 'admin-membership' && (
            <AdminUserManagement 
              users={users} 
              currentUser={currentUser!} 
              onAddUser={() => {}} 
              onUpdateUser={() => {}} 
              onDeleteUser={() => {}} 
              onUpdateStatus={(uid, status, notes) => {
                 setUsers(prev => prev.map(u => u.id === uid ? { ...u, status } : u));
                 logAction('MEMBERSHIP_UPDATE', `Xubinta ${uid} loo beddelay ${status}. Sabab: ${notes}`, uid);
              }} 
              onUpdateRole={(uid, role) => {
                 setUsers(prev => prev.map(u => u.id === uid ? { ...u, role } : u));
                 logAction('ROLE_ASSIGNED', `Xubinta ${uid} loo magacaabay ${role}`, uid);
              }}
            />
          )}

          {view === 'admin-committees' && <AdminCommittees />}

          {view === 'admin-policy' && (
            <GovernanceRegistry 
              ideas={ideas} 
              userRole={currentUser!.role} 
              onEnterStage={handleEnterStage} 
            />
          )}

          {/* STAGE PAGES */}
          {view === 'page-submission' && (
            <SubmissionPage 
              onSubmit={(t, d, c) => { handleAddIdea({title: t, description: d, category: c}); setView('admin-policy'); }} 
              onCancel={() => setView('admin-policy')} 
              userRole={currentUser!.role} 
            />
          )}
          {view === 'page-filtering' && activeIdea && (
            <FilteringPage 
              idea={activeIdea} 
              userRole={currentUser!.role} 
              onAction={(s, n) => updateIdeaState(activeIdea.id, s, { id: `ra_${Date.now()}`, actorId: currentUser!.id, actorName: currentUser!.name, actorRole: currentUser!.role, actionType: 'FILTERING', notes: n, timestamp: new Date().toISOString() })} 
            />
          )}
          {view === 'page-synthesis' && activeIdea && (
            <SynthesisPage 
              idea={activeIdea} 
              userRole={currentUser!.role} 
              onAction={(s, n, v) => updateIdeaState(activeIdea.id, s, { id: `ra_${Date.now()}`, actorId: currentUser!.id, actorName: currentUser!.name, actorRole: currentUser!.role, actionType: 'SYNTHESIS', notes: n, timestamp: new Date().toISOString() }, v)} 
            />
          )}
          {view === 'page-final-guard' && activeIdea && (
            <FinalGuardPage 
              idea={activeIdea} 
              userRole={currentUser!.role} 
              onAction={(s, n) => updateIdeaState(activeIdea.id, s, { id: `ra_${Date.now()}`, actorId: currentUser!.id, actorName: currentUser!.name, actorRole: currentUser!.role, actionType: 'FINAL_GUARD', notes: n, timestamp: new Date().toISOString() })} 
            />
          )}
          {view === 'page-execution' && activeIdea && (
            <ExecutionPage 
              idea={activeIdea} 
              userRole={currentUser!.role} 
              onUpdateProgress={() => {}} 
            />
          )}

          {view === 'admin-jobs' && <AdminJobs jobs={jobs} onAddJob={handleAddJob} />}
          
          {view === 'admin-elections' && (
            <AdminElections 
              elections={elections} 
              jobs={jobs} 
              onCreate={(e) => { setElections(prev => [...prev, e]); logAction('ELECTION_CREATED', `Doorasho cusub: ${e.title}`, e.id); }} 
              onUpdateStatus={(id, status) => { setElections(prev => prev.map(e => e.id === id ? { ...e, status } : e)); logAction('ELECTION_STATUS_CHANGE', `Doorashada ${id} loo beddelay ${status}`, id); }} 
            />
          )}
          
          {view === 'admin-candidates' && (
            <AdminCandidates 
              users={users} 
              candidates={candidates} 
              elections={elections} 
              onRegisterCandidate={(eid, uid, score) => {
                const newCand: CandidateRecord = { id: `cand_${Date.now()}`, userId: uid, electionId: eid, jobId: '', status: CandidateStatus.SUGITAAN, votesCount: 0, statementOfIntent: 'Apply' };
                setCandidates(prev => [...prev, newCand]);
                logAction('CANDIDATE_REGISTERED', `Musharax cusub ee doorashada ${eid}`, newCand.id);
              }} 
              onUpdateCandidate={(id, status, notes) => {
                setCandidates(prev => prev.map(c => c.id === id ? {...c, status} : c));
                logAction('CANDIDATE_VETTED', `Musharaxa ${id} xaaladiisa waa ${status}. Notes: ${notes}`, id);
              }} 
              onUpdateElectionStatus={() => {}} 
              currentUser={currentUser!} 
            />
          )}

          {view === 'voting-terminal' && <VotingTerminal elections={elections} candidates={candidates} votes={votes} currentUserId={currentUser!.id} onVote={(eid, jid, cid) => { setVotes(prev => [...prev, {id: `v_${Date.now()}`, electionId: eid, candidateId: cid, timestamp: new Date().toISOString(), voterId: currentUser!.id, hash: Math.random().toString(36).substr(2, 9)}]); logAction('VOTE_CAST', `Cod ayaa laga dhiibtay doorashada ${eid}`); }} />}
          {view === 'election-results' && <ElectionResults elections={elections} candidates={candidates} onViewAnalytics={() => {}} />}
          {view === 'member-registration' && <JobRegistration elections={elections} jobs={jobs} candidates={candidates} currentUser={currentUser!} onRegister={(c) => { setCandidates(prev => [...prev, {...c, id: `cand_${Date.now()}`, userId: currentUser!.id, status: CandidateStatus.SUGITAAN, votesCount: 0} as CandidateRecord]); logAction('CANDIDACY_SUBMITTED', `Xubintu waxay codsatay tartanka xilka`, currentUser!.id); }} />}
          {view === 'member-submission' && <MemberIdeaSubmission currentUser={currentUser!} onAddIdea={handleAddIdea} onNavigateToDashboard={() => setView('dashboard')} />}
          {view === 'admin-oversight' && <AuditLog auditLogs={auditLogs} />}
          {view === 'admin-memory' && <InstitutionalMemory />}

          {/* ACTIVATION VIEWS */}
          {view === 'activation-team-proposal' && (
            <TeamProposalForm 
              currentUser={currentUser!} 
              jobs={jobs} 
              users={users}
              elections={elections}
              onSubmit={handleSubmitTeamProposal}
              existingProposal={teamProposals.find(p => p.chairpersonId === currentUser?.id)}
            />
          )}
          {view === 'review-council-opinion' && (
            <CouncilOpinionHub 
              proposals={teamProposals} 
              opinions={councilOpinions}
              onSubmitOpinion={(op) => { setCouncilOpinions(prev => [...prev, op]); logAction('COUNCIL_OPINION_SUBMITTED', `Xubin Golaha Dhexe ah ayaa dhiibtay opinion.`, op.proposalId); }}
              currentUser={currentUser!}
            />
          )}
          {view === 'oversight-team-review' && (
            <ActivationOversightHub 
              proposals={teamProposals} 
              opinions={councilOpinions}
              onDecision={handleOversightDecision}
            />
          )}
        </div>
      </main>
      
      <GovernanceAssistant userRole={currentUser!.role} />
    </div>
  );
};

export default App;
