import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminApi } from '../api/admin.api';
import FormInput from '../components/FormInput';
import ResetPasswordModal from '../components/ResetPasswordModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'add-faculty', label: 'Add Faculty' },
  { id: 'add-student', label: 'Add Student' },
  { id: 'faculty', label: 'Faculty List' },
  { id: 'students', label: 'Student List' },
];

/** Success / error banner used for API feedback and validation messages. */
function Banner({ type = 'success', children }) {
  const isSuccess = type === 'success';
  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      className={`flex items-start gap-3 rounded-2xl border p-4 ${
        isSuccess ? 'border-success/30 bg-success/10' : 'border-destructive/30 bg-destructive/10'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`mt-0.5 h-5 w-5 shrink-0 ${isSuccess ? 'text-success' : 'text-destructive'}`}
        aria-hidden="true"
      >
        {isSuccess ? (
          <>
            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
            <path d="m9 11 3 3L22 4" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </>
        )}
      </svg>
      <p className="text-sm font-medium">{children}</p>
    </div>
  );
}

/** Loading skeleton for list tables. */
function TableSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-10 w-full animate-shimmer rounded-xl" />
      ))}
    </div>
  );
}

/** Empty state for the account lists. */
function EmptyState({ title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.128a4 4 0 0 1 0 7.744" />
        </svg>
      </span>
      <p className="font-chakra text-base font-semibold">{title}</p>
      <p className="max-w-xs text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const EMPTY_FACULTY_FORM = { name: '', email: '' };
const EMPTY_STUDENT_FORM = { name: '', email: '', rollNumber: '', branch: 'Information Technology' };

export default function AdminDashboard() {
  const { user } = useAuth();
  // The active tab lives in the URL (?tab=…), so the browser Back button
  // steps from a secondary tab back to the previous one and finally out to
  // the login page, and tab URLs can be refreshed / shared safely.
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const tab = TABS.some((item) => item.id === requestedTab) ? requestedTab : 'add-faculty';

  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [listState, setListState] = useState({ loading: true, error: '' });

  const [facultyForm, setFacultyForm] = useState(EMPTY_FACULTY_FORM);
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT_FORM);
  const [creating, setCreating] = useState(false);
  const [formMessage, setFormMessage] = useState(null); // { type, text }
  const [resetTarget, setResetTarget] = useState(null); // account being reset
  const [toast, setToast] = useState(null); // bottom capsule after a reset

  const loadLists = useCallback(async () => {
    setListState({ loading: true, error: '' });
    try {
      const [facultyData, studentData] = await Promise.all([adminApi.listFaculty(), adminApi.listStudents()]);
      setFaculty(facultyData.faculty);
      setStudents(studentData.students);
      setListState({ loading: false, error: '' });
    } catch (err) {
      setListState({ loading: false, error: err.message || 'Failed to load accounts.' });
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleCreateFaculty = async (event) => {
    event.preventDefault();
    setFormMessage(null);
    setCreating(true);
    try {
      const data = await adminApi.createFaculty(facultyForm);
      setFormMessage({ type: 'success', text: data.message });
      setFacultyForm(EMPTY_FACULTY_FORM);
      loadLists();
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message });
    } finally {
      setCreating(false);
    }
  };

  const handleCreateStudent = async (event) => {
    event.preventDefault();
    setFormMessage(null);
    setCreating(true);
    try {
      const payload = {
        ...studentForm,
        rollNumber: (studentForm.rollNumber || '').trim(),
        email: studentForm.email.trim().toLowerCase(),
      };
      const data = await adminApi.createStudent(payload);
      setFormMessage({ type: 'success', text: `${data.message} Unique QR ID: ${data.student.studentQrId}` });
      setStudentForm(EMPTY_STUDENT_FORM);
      loadLists();
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message });
    } finally {
      setCreating(false);
    }
  };

  const selectTab = (tabId) => {
    setFormMessage(null);
    // Push a history entry (except for the default tab, which keeps the
    // clean /admin URL) so the Back button walks back through the tabs.
    setSearchParams(tabId === 'add-faculty' ? {} : { tab: tabId });
  };

  // Clear stale success/error banners when the tab changes (including via Back).
  useEffect(() => {
    setFormMessage(null);
  }, [tab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Greeting hero */}
      <section className="animate-element relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-navy via-brand-blue to-brand-navy p-6 text-white shadow-xl sm:p-8 lg:flex-row lg:items-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand-teal/25 blur-3xl" />
        <div className="relative min-w-0">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/70">Admin console</span>
          <h1 className="mt-2 font-chakra text-2xl font-bold tracking-tight sm:text-3xl">
            Hello, {user?.name || 'Admin'}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
            <span className="font-mono">{user?.email}</span>
            <span className="text-white/40">•</span>
            <span className="inline-flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Administrator
            </span>
          </p>
        </div>
        <div className="relative flex shrink-0 gap-3">
          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur-md">
            <p className="font-chakra text-2xl font-bold">{listState.loading ? '—' : faculty.length}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">Faculty</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur-md">
            <p className="font-chakra text-2xl font-bold">{listState.loading ? '—' : students.length}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">Students</p>
          </div>
        </div>
      </section>

      {/* Simple navigation */}
      <nav className="animate-element animate-delay-100 mt-6 flex flex-wrap gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-sm" aria-label="Admin dashboard sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectTab(item.id)}
            aria-current={tab === item.id ? 'page' : undefined}
            className={`rounded-xl px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
              tab === item.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {formMessage && (
        <div className="animate-element mt-6">
          <Banner type={formMessage.type}>{formMessage.text}</Banner>
        </div>
      )}

      {listState.error && (
        <div className="animate-element mt-6">
          <Banner type="error">
            {listState.error}{' '}
            <button type="button" onClick={loadLists} className="font-semibold underline underline-offset-2">
              Retry
            </button>
          </Banner>
        </div>
      )}

      {/* Add Faculty */}
      {tab === 'add-faculty' && (
        <section className="animate-element animate-delay-150 mt-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6" />
                <path d="M22 11h-6" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="font-chakra text-base font-semibold tracking-tight">Create a Faculty account</h2>
              <p className="truncate text-xs text-muted-foreground">No password to set — it defaults to the email address</p>
            </div>
          </div>

          <form onSubmit={handleCreateFaculty} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
            <FormInput
              label="Full name"
              id="faculty-name"
              value={facultyForm.name}
              onChange={(event) => setFacultyForm({ ...facultyForm, name: event.target.value })}
              placeholder="e.g. Dr. P. Sharma"
              required
            />
            <FormInput
              label="Email"
              id="faculty-email"
              type="email"
              value={facultyForm.email}
              onChange={(event) => setFacultyForm({ ...facultyForm, email: event.target.value })}
              placeholder="faculty@iare.ac.in"
              autoComplete="off"
              required
              mono
            />
            <div className="flex items-end sm:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {creating ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 animate-spin" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Creating…
                  </>
                ) : (
                  'Create Faculty account'
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Add Student */}
      {tab === 'add-student' && (
        <section className="animate-element animate-delay-150 mt-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="font-chakra text-base font-semibold tracking-tight">Create a Student account</h2>
              <p className="truncate text-xs text-muted-foreground">Password defaults to the email · a unique QR ID is generated automatically</p>
            </div>
          </div>

          <form onSubmit={handleCreateStudent} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
            <FormInput
              label="Full name"
              id="student-name"
              value={studentForm.name}
              onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })}
              placeholder="e.g. A. Reddy"
              required
            />
            <FormInput
              label="Roll number"
              id="student-roll"
              value={studentForm.rollNumber}
              onChange={(event) => setStudentForm({ ...studentForm, rollNumber: event.target.value })}
              placeholder="e.g. 26951A1255"
              autoComplete="off"
              required
              mono
            />
            <FormInput
              label="Email"
              id="student-email"
              type="email"
              value={studentForm.email}
              onChange={(event) => setStudentForm({ ...studentForm, email: event.target.value })}
              placeholder="rollnumber@iare.ac.in"
              autoComplete="off"
              required
              mono
            />
            <FormInput
              label="Branch"
              id="student-branch"
              value={studentForm.branch}
              onChange={(event) => setStudentForm({ ...studentForm, branch: event.target.value })}
              placeholder="e.g. Information Technology"
              autoComplete="off"
              required
            />
            <div className="flex items-end sm:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {creating ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 animate-spin" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Creating…
                  </>
                ) : (
                  'Create Student account'
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Faculty list */}
      {tab === 'faculty' && (
        <section className="animate-element animate-delay-150 mt-6 rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 p-5 sm:p-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.128a4 4 0 0 1 0 7.744" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="font-chakra text-base font-semibold tracking-tight">Faculty accounts</h2>
              <p className="truncate text-xs text-muted-foreground">
                {listState.loading ? 'Loading…' : `${faculty.length} account${faculty.length === 1 ? '' : 's'} created`}
              </p>
            </div>
          </div>

          {listState.loading ? (
            <TableSkeleton />
          ) : faculty.length === 0 ? (
            <EmptyState
              title="No faculty accounts yet"
              hint="Use the “Add Faculty” tab to create the first faculty account."
            />
          ) : (
            <div className="mx-4 mb-4 overflow-x-auto rounded-2xl border border-border sm:mx-5 sm:mb-5">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                  <tr className="text-left font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">Email</th>
                    <th className="px-4 py-2.5 text-right font-medium">Created</th>
                    <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((member) => (
                    <tr key={member.id} className="border-t border-border/70 transition-colors hover:bg-muted/40">
                      <td className="px-4 py-2.5 font-semibold">{member.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{member.email}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-muted-foreground">{formatDate(member.createdAt)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setResetTarget(member)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-brand-teal/50 hover:text-brand-teal"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                          </svg>
                          Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Student list */}
      {tab === 'students' && (
        <section className="animate-element animate-delay-150 mt-6 rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 p-5 sm:p-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="font-chakra text-base font-semibold tracking-tight">Student accounts</h2>
              <p className="truncate text-xs text-muted-foreground">
                {listState.loading ? 'Loading…' : `${students.length} account${students.length === 1 ? '' : 's'} created`}
              </p>
            </div>
          </div>

          {listState.loading ? (
            <TableSkeleton rows={4} />
          ) : students.length === 0 ? (
            <EmptyState
              title="No student accounts yet"
              hint="Use the “Add Student” tab to create the first student account — each student gets a unique QR ID."
            />
          ) : (
            <div className="mx-4 mb-4 overflow-x-auto rounded-2xl border border-border sm:mx-5 sm:mb-5">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                  <tr className="text-left font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">Roll no</th>
                    <th className="px-4 py-2.5 font-medium">Branch</th>
                    <th className="px-4 py-2.5 font-medium">Email</th>
                    <th className="px-4 py-2.5 font-medium">QR ID</th>
                    <th className="px-4 py-2.5 text-right font-medium">Created</th>
                    <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-t border-border/70 transition-colors hover:bg-muted/40">
                      <td className="px-4 py-2.5 font-semibold">{student.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs">{student.rollNumber}</td>
                      <td className="px-4 py-2.5 text-xs">{student.branch || '—'}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{student.email}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-brand-blue">{student.studentQrId}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-muted-foreground">{formatDate(student.createdAt)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setResetTarget(student)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-brand-teal/50 hover:text-brand-teal"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                          </svg>
                          Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Admin password-reset dialog for a Faculty/Student row */}
      {resetTarget && (
        <ResetPasswordModal
          target={resetTarget}
          onClose={() => setResetTarget(null)}
          onSuccess={(text) => {
            setResetTarget(null);
            setToast(text);
          }}
        />
      )}

      {/* Sleek bottom-capsule confirmation after a password reset */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
