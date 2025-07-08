

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/icons/Footer';
import SearchBar from './components/SearchBar';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import WeeklyScanTimer from './components/WeeklyScanTimer';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import ComparisonLayout from './components/ComparisonLayout';
import CompetitorControls from './components/CompetitorControls';
import SubscriptionPage from './components/SubscriptionPage';
import PaymentPage from './components/PaymentPage';
import LandingPage from './components/LandingPage'; // Added LandingPage import
import { analyzeProductFeedback } from './services/feedbackAnalyzerService';
import { Issue, ProductInstanceData, AppStorage, FilterState } from './types';
import ProductInstanceMenu from './components/ProductInstanceMenu'; 
import { DocumentMagnifyingGlassIcon } from './components/icons/DocumentMagnifyingGlassIcon';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // Approximate for Free tier conceptual scan

// localStorage Keys
const APP_STORAGE_KEY = 'productHolmes_appStorage';
const AUTH_KEY = 'productHolmes_isAuthenticated'; 
const SELECTED_PLAN_KEY = 'productHolmes_selectedPlan';
const PAYMENT_COMPLETED_KEY = 'productHolmes_paymentCompleted';
const FREE_TIER_SCANS_COUNT_KEY = 'productHolmes_freeTierScansCount';
const FREE_TIER_LAST_RESET_KEY = 'productHolmes_freeTierLastReset';


const sortIssuesByOccurrences = (issues: Issue[]): Issue[] => {
  return [...issues].sort((a, b) => (b.totalOccurrences || 0) - (a.totalOccurrences || 0));
};

const generateNewInstanceId = () => `inst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const createNewProductInstance = (id?: string, name: string = ''): ProductInstanceData => ({
  id: id || generateNewInstanceId(),
  productName: name, 
  issues: [],
  isLoading: false,
  error: null,
  hasSearched: false,
  lastScanTimestamp: null,
  nextScanDue: null,
  competitorProductName: null,
  competitorIssues: [],
  isCompetitorLoading: false,
  competitorError: null,
});

export type AppView = 'landing' | 'login' | 'signup' | 'subscription' | 'payment' | 'app'; // Added 'landing'

interface AnalysisQueueItem {
  instanceId: string;
  name: string;
  isCompetitor: boolean;
  planForAnalysis: string | null;
}

const initialFilterState: FilterState = {
  keyword: '',
  category: null,
  sourceType: null,
  startDate: null,
  endDate: null,
};

const App: React.FC = () => {
  const getInitialView = (): AppView => {
    try {
      const isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';
      if (!isAuthenticated) return 'landing'; // Start at landing if not authenticated

      const plan = localStorage.getItem(SELECTED_PLAN_KEY);
      const paymentCompleted = localStorage.getItem(PAYMENT_COMPLETED_KEY) === 'true';

      if (!plan) return 'subscription';
      if (!paymentCompleted) return 'payment';
      return 'app';
    } catch (e) {
      console.warn("Could not determine initial view from localStorage", e);
      return 'landing'; // Default to landing on error
    }
  };
  
  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
    try { return localStorage.getItem(SELECTED_PLAN_KEY); } 
    catch (e) { console.warn("Could not read selected plan from localStorage", e); return null; }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try { return localStorage.getItem(AUTH_KEY) === 'true'; } 
    catch (e) { console.warn("Could not read auth state from localStorage", e); return false; }
  });

  const [productInstances, setProductInstances] = useState<Map<string, ProductInstanceData>>(new Map());
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null); // null means draft mode
  const [draftInstanceData, setDraftInstanceData] = useState<ProductInstanceData | null>(null);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [analysisQueue, setAnalysisQueue] = useState<AnalysisQueueItem | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Free Tier Usage State
  const [freeTierScansThisMonth, setFreeTierScansThisMonth] = useState<number>(0);
  const [lastFreeTierScanReset, setLastFreeTierScanReset] = useState<number | null>(null);


  // Load initial data from localStorage
  useEffect(() => {
    if (currentView === 'app') {
      try {
        const storedAppDataString = localStorage.getItem(APP_STORAGE_KEY);
        if (storedAppDataString) {
          const storedAppData: AppStorage = JSON.parse(storedAppDataString);
          const loadedInstances = new Map<string, ProductInstanceData>();
          if (storedAppData.productInstances) {
            Object.entries(storedAppData.productInstances).forEach(([id, data]) => {
              const currentPlanFromStorage = localStorage.getItem(SELECTED_PLAN_KEY) || 'free'; 
              const scanInterval = currentPlanFromStorage === 'free' ? ONE_MONTH_MS : ONE_WEEK_MS;
              loadedInstances.set(id, {
                ...data,
                issues: sortIssuesByOccurrences(data.issues || []),
                competitorIssues: sortIssuesByOccurrences(data.competitorIssues || []),
                nextScanDue: (currentPlanFromStorage !== 'free' && data.lastScanTimestamp) ? data.lastScanTimestamp + scanInterval : null,
              });
            });
          }

          if (loadedInstances.size > 0) {
            setProductInstances(loadedInstances);
            const lastActiveId = storedAppData.activeInstanceId; 
            if (lastActiveId && loadedInstances.has(lastActiveId)) {
              setActiveInstanceId(lastActiveId);
              setDraftInstanceData(null); 
            } else if (loadedInstances.size > 0) { 
              setActiveInstanceId(loadedInstances.keys().next().value);
              setDraftInstanceData(null);
            } else { 
                 const defaultDraft = createNewProductInstance(undefined, ""); 
                 setDraftInstanceData(defaultDraft);
                 setActiveInstanceId(null);
            }
          } else { 
            const defaultDraft = createNewProductInstance(undefined, ""); 
            setDraftInstanceData(defaultDraft);
            setActiveInstanceId(null); 
          }
        } else { 
          const defaultDraft = createNewProductInstance(undefined, "");
          setDraftInstanceData(defaultDraft);
          setActiveInstanceId(null); 
        }

        // Load Free Tier scan counts
        const storedScansCount = localStorage.getItem(FREE_TIER_SCANS_COUNT_KEY);
        const storedLastReset = localStorage.getItem(FREE_TIER_LAST_RESET_KEY);
        setFreeTierScansThisMonth(storedScansCount ? parseInt(storedScansCount, 10) : 0);
        setLastFreeTierScanReset(storedLastReset ? parseInt(storedLastReset, 10) : null);

      } catch (e) {
        console.error("Failed to load app data from localStorage:", e);
        const defaultDraft = createNewProductInstance(undefined, "");
        setDraftInstanceData(defaultDraft);
        setActiveInstanceId(null); 
      }
    }
  }, [currentView]); 

  // Save data to localStorage
  useEffect(() => {
    if (currentView === 'app') {
      try {
        const instancesObject: { [id: string]: ProductInstanceData } = {};
        productInstances.forEach((instance, id) => {
          instancesObject[id] = instance;
        });
        const appDataToStore: AppStorage = {
          productInstances: instancesObject,
          activeInstanceId: activeInstanceId, 
        };
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appDataToStore));
        localStorage.setItem(FREE_TIER_SCANS_COUNT_KEY, freeTierScansThisMonth.toString());
        if (lastFreeTierScanReset) {
          localStorage.setItem(FREE_TIER_LAST_RESET_KEY, lastFreeTierScanReset.toString());
        } else {
          localStorage.removeItem(FREE_TIER_LAST_RESET_KEY);
        }

      } catch (e) {
        console.error("Failed to save app data to localStorage:", e);
      }
    }
  }, [productInstances, activeInstanceId, currentView, freeTierScansThisMonth, lastFreeTierScanReset]);
  
  const activeProductInstance: ProductInstanceData | null | undefined = 
    activeInstanceId 
      ? productInstances.get(activeInstanceId) 
      : draftInstanceData;

  const updateInstanceData = useCallback((instanceId: string, updates: Partial<ProductInstanceData>) => {
    setProductInstances(prev => {
      const newInstances = new Map(prev);
      const currentInstance = newInstances.get(instanceId);
      if (currentInstance) {
        const updatedInstance = { ...currentInstance, ...updates };
        if (updates.issues) {
          updatedInstance.issues = sortIssuesByOccurrences(updates.issues);
        }
        if (updates.competitorIssues) {
          updatedInstance.competitorIssues = sortIssuesByOccurrences(updates.competitorIssues);
        }
        if ('lastScanTimestamp' in updates && updates.lastScanTimestamp !== currentInstance.lastScanTimestamp) {
            const currentPlanForUpdate = selectedPlan || (localStorage.getItem(SELECTED_PLAN_KEY) || 'free'); 
          if (currentPlanForUpdate !== 'free' && updates.lastScanTimestamp) {
            const scanInterval = ONE_WEEK_MS; 
            updatedInstance.nextScanDue = updates.lastScanTimestamp + scanInterval;
          } else {
            updatedInstance.nextScanDue = null; 
          }
        }
        newInstances.set(instanceId, updatedInstance);
        return newInstances;
      }
      return prev;
    });
  }, [selectedPlan]); 
  
  const performAnalysis = useCallback(async (instanceIdToAnalyze: string, name: string, isCompetitorLoad: boolean = false, planForThisAnalysis: string | null) => {
    const instanceForAnalysis = productInstances.get(instanceIdToAnalyze);
    if (!instanceForAnalysis) {
      console.error(`performAnalysis called for non-existent instance ID: ${instanceIdToAnalyze}`);
       if (!activeInstanceId && draftInstanceData) { 
        setDraftInstanceData(prevDraft => prevDraft ? {...prevDraft, error: "Failed to initialize analysis. Instance context lost.", isLoading: false} : null);
      } else if (activeInstanceId === instanceIdToAnalyze) {
         updateInstanceData(instanceIdToAnalyze, 
            isCompetitorLoad 
            ? { competitorError: "Analysis failed: Instance context error.", isCompetitorLoading: false } 
            : { error: "Analysis failed: Instance context error.", isLoading: false }
        );
      }
      return;
    }
    
    updateInstanceData(instanceIdToAnalyze, 
      isCompetitorLoad 
        ? { isCompetitorLoading: true, competitorError: null, competitorProductName: name } 
        : { isLoading: true, error: null, hasSearched: true, productName: name, competitorProductName: null, competitorIssues: [], competitorError: null, isCompetitorLoading: false }
    );
    
    try {
      const fetchedIssues = await analyzeProductFeedback(name, planForThisAnalysis);
      const newScanTimestamp = Date.now();
      if (isCompetitorLoad) {
        updateInstanceData(instanceIdToAnalyze, {
          competitorIssues: fetchedIssues,
          isCompetitorLoading: false,
        });
      } else {
        updateInstanceData(instanceIdToAnalyze, {
          issues: fetchedIssues,
          lastScanTimestamp: newScanTimestamp, 
          isLoading: false,
        });
      }
    } catch (err: any) {
      console.error(`Error analyzing ${name} for instance ${instanceIdToAnalyze}:`, err);
      const errorMessage = err.message || (isCompetitorLoad ? 'Failed to analyze competitor product.' : 'Failed to analyze product.');
      if (isCompetitorLoad) {
        updateInstanceData(instanceIdToAnalyze, { competitorError: errorMessage, isCompetitorLoading: false });
      } else {
        updateInstanceData(instanceIdToAnalyze, { 
          error: errorMessage, 
          isLoading: false, 
          issues: [], 
          lastScanTimestamp: null 
        });
      }
    }
  }, [productInstances, updateInstanceData, activeInstanceId, draftInstanceData]);

  useEffect(() => {
    if (analysisQueue) {
      const { instanceId, name, isCompetitor, planForAnalysis } = analysisQueue;
      
      if (productInstances.has(instanceId) && activeInstanceId === instanceId) {
        performAnalysis(instanceId, name, isCompetitor, planForAnalysis);
        setAnalysisQueue(null); 
      } else if (!productInstances.has(instanceId) && draftInstanceData && draftInstanceData.id === instanceId) {
        
        const registeredInstance = productInstances.get(activeInstanceId || "");
        if (registeredInstance && registeredInstance.id === instanceId) {
          performAnalysis(instanceId, name, isCompetitor, planForAnalysis);
          setAnalysisQueue(null);
        }
      }
    }
  }, [analysisQueue, productInstances, activeInstanceId, performAnalysis, draftInstanceData]);


  const handleAnalyze = useCallback((searchName: string) => {
    if (!searchName.trim()) return;
    const trimmedSearchName = searchName.trim();
    setFilters(initialFilterState); 

    const currentPlanForAnalysis = selectedPlan || localStorage.getItem(SELECTED_PLAN_KEY) || 'free';
    const isFreeTier = currentPlanForAnalysis === 'free';
    let proceedWithAnalysis = true;
    let newAnalysisSession = false; // Flag to indicate if this counts as a new free tier scan

    // Determine if this is a new analysis session for free tier global limit
    if (isFreeTier) {
      if (!activeInstanceId || (productInstances.get(activeInstanceId!)?.productName !== trimmedSearchName)) {
        newAnalysisSession = true;
      }
    }
    
    // Check Free Tier GLOBAL monthly limit for NEW analyses
    if (isFreeTier && newAnalysisSession) {
      const now = Date.now();
      let currentScans = freeTierScansThisMonth;
      let currentResetTimestamp = lastFreeTierScanReset;

      if (!currentResetTimestamp || (now - currentResetTimestamp > ONE_MONTH_MS)) {
        currentScans = 0;
        currentResetTimestamp = now;
        setLastFreeTierScanReset(now); 
      }

      if (currentScans >= 1) { // Free tier limit is 1 new analysis per month
        const nextAvailableGlobalDate = new Date((currentResetTimestamp || now) + ONE_MONTH_MS);
        const globalErrorMessage = `Free tier allows one new product investigation per month. Next new investigation available on ${nextAvailableGlobalDate.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}. You can still re-analyze existing products if their individual monthly limit hasn't been reached.`;
        if (activeInstanceId && productInstances.has(activeInstanceId)) {
          updateInstanceData(activeInstanceId, { error: globalErrorMessage, isLoading: false });
        } else if (draftInstanceData) {
          setDraftInstanceData(prevDraft => prevDraft ? { ...prevDraft, error: globalErrorMessage, isLoading: false } : null);
        }
        proceedWithAnalysis = false;
      }
    }


    // Check Free Tier PER-PRODUCT monthly limit if re-analyzing an existing product
    if (proceedWithAnalysis && isFreeTier && activeInstanceId) {
        const instanceToCheck = productInstances.get(activeInstanceId);
        if (instanceToCheck && instanceToCheck.productName === trimmedSearchName && instanceToCheck.lastScanTimestamp) {
            const timeSinceLastScan = Date.now() - instanceToCheck.lastScanTimestamp;
            if (timeSinceLastScan < ONE_MONTH_MS) {
                const nextAvailableDate = new Date(instanceToCheck.lastScanTimestamp + ONE_MONTH_MS);
                const errorMessage = `Free tier allows one manual analysis per month for "${instanceToCheck.productName}". Next analysis for this product available on ${nextAvailableDate.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}.`;
                updateInstanceData(activeInstanceId, { error: errorMessage, isLoading: false });
                proceedWithAnalysis = false; 
            }
        }
    }
    
    if (!proceedWithAnalysis) return;

    // Clear previous error before new analysis attempt
    if (activeInstanceId && productInstances.has(activeInstanceId)) {
        const currentInstance = productInstances.get(activeInstanceId)!;
        if (currentInstance.error) updateInstanceData(activeInstanceId, { error: null });
    } else if (draftInstanceData && draftInstanceData.error) {
        setDraftInstanceData(prevDraft => prevDraft ? { ...prevDraft, error: null } : null);
    }


    if (!activeInstanceId && draftInstanceData) { 
      const instanceToRegister: ProductInstanceData = { 
        ...draftInstanceData, 
        productName: trimmedSearchName, 
        hasSearched: true, 
        isLoading: true, 
        error: null, 
      };
      
      setProductInstances(prev => new Map(prev).set(instanceToRegister.id, instanceToRegister));
      setActiveInstanceId(instanceToRegister.id);
      setDraftInstanceData(null); 
      setAnalysisQueue({ instanceId: instanceToRegister.id, name: trimmedSearchName, isCompetitor: false, planForAnalysis: currentPlanForAnalysis });
      if (isFreeTier && newAnalysisSession) { // Only increment if it's truly a new session for free tier
        setFreeTierScansThisMonth(prev => prev + 1);
        if (!lastFreeTierScanReset) setLastFreeTierScanReset(Date.now()); // Set reset if it's the first scan in a cycle
      }

    } else if (activeInstanceId && productInstances.has(activeInstanceId)) { 
      const currentInstance = productInstances.get(activeInstanceId)!;
      // If product name changes, it's like a new analysis. Reset its specific data.
      if (currentInstance.productName !== trimmedSearchName) {
         updateInstanceData(activeInstanceId, { productName: trimmedSearchName, issues: [], competitorProductName: null, competitorIssues: [], lastScanTimestamp: null, nextScanDue: null, error: null, competitorError: null });
         if (isFreeTier && newAnalysisSession) { // Product name changed, counts as a new scan for free tier
            setFreeTierScansThisMonth(prev => prev + 1);
            if (!lastFreeTierScanReset) setLastFreeTierScanReset(Date.now());
         }
      }
      // If product name is the same, it's a re-analysis, already handled by per-product limit check.
      // Do not increment global free tier scan count for re-analyzing an existing product.
      setAnalysisQueue({ instanceId: activeInstanceId, name: trimmedSearchName, isCompetitor: false, planForAnalysis: currentPlanForAnalysis });
    } else {
      console.error("handleAnalyze called in an unexpected state.");
       if (draftInstanceData) {
        setDraftInstanceData(prev => prev ? {...prev, error: "System error: could not start analysis.", isLoading: false} : null);
      }
    }
  }, [activeInstanceId, draftInstanceData, productInstances, updateInstanceData, selectedPlan, freeTierScansThisMonth, lastFreeTierScanReset]);

  const handleAnalyzeCompetitor = useCallback((competitorName: string) => {
    if (!competitorName.trim()) return;
    const currentPlanForAnalysis = selectedPlan || localStorage.getItem(SELECTED_PLAN_KEY) || 'free';
    if (currentPlanForAnalysis !== 'max') {
        alert("Competitor analysis is a Max Tier feature. Please upgrade your plan."); 
        if (activeInstanceId && productInstances.has(activeInstanceId)) {
            updateInstanceData(activeInstanceId, { competitorError: "Upgrade to Max Tier for competitor analysis."});
        } else if (draftInstanceData) {
            setDraftInstanceData(d => d ? {...d, competitorError: "Upgrade to Max Tier for competitor analysis."} : null);
        }
        return;
    }

    const trimmedCompetitorName = competitorName.trim();
    
    if (activeInstanceId && productInstances.has(activeInstanceId)) {
      setAnalysisQueue({ instanceId: activeInstanceId, name: trimmedCompetitorName, isCompetitor: true, planForAnalysis: currentPlanForAnalysis });
    } else {
      console.warn("Attempted to analyze competitor without an active registered product instance.");
      if (draftInstanceData) {
        setDraftInstanceData(d => d ? {...d, competitorError: "Please analyze a primary product first."} : null);
      }
    }
  }, [activeInstanceId, productInstances, draftInstanceData, selectedPlan, updateInstanceData]);
  
  const handleResolveIssue = useCallback((issueId: string) => {
    if (!activeInstanceId || !productInstances.has(activeInstanceId)) return;
    const currentInstance = productInstances.get(activeInstanceId)!;
    const updatedIssues = currentInstance.issues.filter(issue => issue.id !== issueId);
    updateInstanceData(activeInstanceId, { issues: updatedIssues });
  }, [activeInstanceId, productInstances, updateInstanceData]);
  
  const handleResolveCompetitorIssue = useCallback((issueId: string) => {
    if (!activeInstanceId || !productInstances.has(activeInstanceId)) return;
     const currentInstance = productInstances.get(activeInstanceId)!;
    if (currentInstance) {
      const updatedIssues = currentInstance.competitorIssues.filter(issue => issue.id !== issueId);
      updateInstanceData(activeInstanceId, { competitorIssues: updatedIssues });
    }
  }, [activeInstanceId, productInstances, updateInstanceData]);

  const handleClearCompetitor = useCallback(() => {
    if (activeInstanceId && productInstances.has(activeInstanceId)) {
      updateInstanceData(activeInstanceId, {
        competitorProductName: null,
        competitorIssues: [],
        competitorError: null,
        isCompetitorLoading: false,
      });
    } else if (draftInstanceData) { 
        setDraftInstanceData(d => d ? {
            ...d,
            competitorProductName: null,
            competitorIssues: [],
            competitorError: null,
            isCompetitorLoading: false,
        } : null);
    }
  }, [activeInstanceId, updateInstanceData, draftInstanceData]);

  const handleAddNewInstance = useCallback(() => {
    const newDraft = createNewProductInstance(undefined, ""); 
    setDraftInstanceData(newDraft);
    setActiveInstanceId(null); 
    setShowProductMenu(false); 
    setFilters(initialFilterState); 
  }, []);

  const handleSelectInstance = useCallback((instanceId: string) => {
    if (productInstances.has(instanceId)) {
      setActiveInstanceId(instanceId);
      setDraftInstanceData(null); 
      setShowProductMenu(false); 
      setFilters(initialFilterState); 
    }
  }, [productInstances]);

  const handleDeleteInstance = useCallback((instanceIdToDelete: string) => {
    if (!window.confirm("Are you sure you want to delete this product investigation? This action cannot be undone.")) {
        return;
    }

    setProductInstances(prev => {
        const newInstances = new Map(prev);
        newInstances.delete(instanceIdToDelete);
        
        if (activeInstanceId === instanceIdToDelete) { 
            if (newInstances.size > 0) {
                setActiveInstanceId(newInstances.keys().next().value); 
                setDraftInstanceData(null); 
            } else { 
                const newDraft = createNewProductInstance(undefined, "");
                setDraftInstanceData(newDraft);
                setActiveInstanceId(null); 
            }
             setFilters(initialFilterState);
        }
        return newInstances;
    });
    setShowProductMenu(false);
  }, [activeInstanceId]);


  const handleResetActiveInstance = useCallback(() => { 
    if (activeInstanceId && productInstances.has(activeInstanceId)) { 
      const current = productInstances.get(activeInstanceId)!;
      if (window.confirm(`Are you sure you want to reset the current investigation for "${current.productName || 'this product'}"? All its data (issues, competitor) will be cleared.`)){
        const resetInstanceData = createNewProductInstance(activeInstanceId, ""); 
        updateInstanceData(activeInstanceId, resetInstanceData);
        setFilters(initialFilterState); 
      }
    } else if (!activeInstanceId && draftInstanceData) { 
      if (window.confirm(`Are you sure you want to clear the current new investigation draft?`)){
        setDraftInstanceData(createNewProductInstance(undefined, "")); 
        setFilters(initialFilterState);
      }
    }
    setShowProductMenu(false);
  }, [activeInstanceId, draftInstanceData, productInstances, updateInstanceData]);
  
  const handleToggleProductMenu = useCallback(() => {
    setShowProductMenu(prev => !prev);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem(AUTH_KEY, 'true');
      const plan = localStorage.getItem(SELECTED_PLAN_KEY);
      const paymentCompleted = localStorage.getItem(PAYMENT_COMPLETED_KEY) === 'true';

      setSelectedPlan(plan);

      if (plan && paymentCompleted) setCurrentView('app');
      else if (plan) setCurrentView('payment'); 
      else setCurrentView('subscription');
    } catch (e) { console.warn("Could not save auth state or plan to localStorage", e); setCurrentView('subscription'); }
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_KEY);
      // Optional: Clear other app-specific data on logout for a cleaner experience if desired
      // localStorage.removeItem(SELECTED_PLAN_KEY);
      // localStorage.removeItem(PAYMENT_COMPLETED_KEY);
      // localStorage.removeItem(APP_STORAGE_KEY);
      // setProductInstances(new Map());
      // setActiveInstanceId(null);
      // setDraftInstanceData(createNewProductInstance(undefined, ""));
      // setSelectedPlan(null);
    } catch (e) { console.warn("Could not clear auth state from localStorage", e); }
    setCurrentView('landing'); // Navigate to landing page on logout
    setShowProductMenu(false);
  }, []);

  const handleSelectPlan = useCallback((planName: string) => {
    setSelectedPlan(planName);
    try { 
        localStorage.setItem(SELECTED_PLAN_KEY, planName); 
        localStorage.removeItem(PAYMENT_COMPLETED_KEY); 
         // Reset Free Tier scan counts if moving away from Free
        if (planName !== 'free') {
          localStorage.removeItem(FREE_TIER_SCANS_COUNT_KEY);
          localStorage.removeItem(FREE_TIER_LAST_RESET_KEY);
          setFreeTierScansThisMonth(0);
          setLastFreeTierScanReset(null);
        } else {
            // If selecting Free, ensure counts are loaded or initialized
            const storedScansCount = localStorage.getItem(FREE_TIER_SCANS_COUNT_KEY);
            const storedLastReset = localStorage.getItem(FREE_TIER_LAST_RESET_KEY);
            setFreeTierScansThisMonth(storedScansCount ? parseInt(storedScansCount, 10) : 0);
            setLastFreeTierScanReset(storedLastReset ? parseInt(storedLastReset, 10) : null);
        }
    } 
    catch (e) { console.warn("Could not save selected plan or clear payment to localStorage", e); }
    setCurrentView('payment');
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    try { localStorage.setItem(PAYMENT_COMPLETED_KEY, 'true'); } 
    catch (e) { console.warn("Could not save payment completion status to localStorage", e); }
    
    const currentPlanFromStorage = localStorage.getItem(SELECTED_PLAN_KEY);
    setSelectedPlan(currentPlanFromStorage);

    setProductInstances(prevInstances => {
        const newInstances = new Map(prevInstances);
        newInstances.forEach((instance, id) => {
            const scanInterval = (currentPlanFromStorage || 'free') === 'free' ? ONE_MONTH_MS : ONE_WEEK_MS;
            const updatedInstance = {
                ...instance,
                nextScanDue: (currentPlanFromStorage !== 'free' && instance.lastScanTimestamp) 
                                ? instance.lastScanTimestamp + scanInterval 
                                : null,
            };
            newInstances.set(id, updatedInstance);
        });
        return newInstances;
    });
    
    setCurrentView('app');
  }, []);

  const handleGoToSubscription = useCallback(() => { setCurrentView('subscription'); }, []);
  const handleNavigateToSignUp = useCallback(() => { setCurrentView('signup'); }, []);
  const handleSignUpSuccess = useCallback(() => { setCurrentView('login'); }, []); // After sign up, go to login
  const handleNavigateToLogin = useCallback(() => { setCurrentView('login'); }, []);

  const handleFiltersChange = useCallback((newFilterValues: Partial<FilterState>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilterValues }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  useEffect(() => {
    if (currentView === 'app' && isAuthenticated) { 
        setProductInstances(prevInstances => {
            const newInstances = new Map(prevInstances);
            let changed = false;
            newInstances.forEach((instance, id) => {
                const scanInterval = (selectedPlan || 'free') === 'free' ? ONE_MONTH_MS : ONE_WEEK_MS;
                const newNextScanDue = (selectedPlan !== 'free' && instance.lastScanTimestamp)
                                       ? instance.lastScanTimestamp + scanInterval
                                       : null;
                if (instance.nextScanDue !== newNextScanDue) {
                    newInstances.set(id, { ...instance, nextScanDue: newNextScanDue });
                    changed = true;
                }
            });
            return changed ? newInstances : prevInstances;
        });
    }
  }, [selectedPlan, currentView, isAuthenticated]);


  if (currentView === 'landing') return <LandingPage onNavigateToLogin={handleNavigateToLogin} onNavigateToSignUp={handleNavigateToSignUp} />;
  if (currentView === 'login') return <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={handleNavigateToSignUp} />;
  if (currentView === 'signup') return <SignUpScreen onSignUpSuccess={handleSignUpSuccess} onNavigateToLogin={handleNavigateToLogin} />;
  if (currentView === 'subscription') return <SubscriptionPage currentPlan={selectedPlan} onSelectPlan={handleSelectPlan} />;
  if (currentView === 'payment') return <PaymentPage selectedPlan={selectedPlan} onPaymentSuccess={handlePaymentSuccess} />;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      <Header 
        onGoHome={handleResetActiveInstance}
        currentView={currentView}
        selectedPlan={selectedPlan}
        onGoToSubscription={handleGoToSubscription}
        onLogout={handleLogout}
        onToggleProductMenu={handleToggleProductMenu}
        onAddNewInstance={handleAddNewInstance}
        activeProductName={activeProductInstance?.productName || "New Investigation"}
        isProductMenuOpen={showProductMenu}
      />
      <ProductInstanceMenu
        isOpen={showProductMenu}
        instances={Array.from(productInstances.values())} 
        activeInstanceId={activeInstanceId} 
        onSelectInstance={handleSelectInstance}
        onDeleteInstance={handleDeleteInstance}
        onClose={() => setShowProductMenu(false)}
      />
      <main 
        key={activeProductInstance?.id || 'draft_view'} 
        className="flex-grow container mx-auto px-2 sm:px-4 pt-28 md:pt-32 pb-8 main-content-area"
      >
        {!activeProductInstance && currentView === 'app' ? ( 
          <div className="flex flex-col items-center justify-center h-full animate-fadeInUp">
            <LoadingSpinner />
            <p className="mt-4 text-sky-300">Loading Product Holmes...</p>
          </div>
        ) : activeProductInstance ? ( 
          <>
            <SearchBar 
                onAnalyze={handleAnalyze} 
                isLoading={activeProductInstance.isLoading}
                initialProductName={activeProductInstance.productName} 
            />
            
            {activeProductInstance.error && (
              <div 
                className={`my-6 p-4 rounded-lg text-center shadow-lg animate-slideDownAndFadeInTiny
                  ${activeProductInstance.error.includes("Free tier allows one manual analysis") || activeProductInstance.error.includes("Free tier allows one new product investigation")
                    ? "bg-yellow-800/30 border border-yellow-700/50"
                    : "bg-red-800/30 border border-red-700/50"
                  }`}
                role="alert"
              >
                <h3 className={`text-lg font-semibold mb-1 font-orbitron 
                  ${activeProductInstance.error.includes("Free tier allows one manual analysis") || activeProductInstance.error.includes("Free tier allows one new product investigation")
                    ? "text-yellow-300"
                    : "text-red-300"
                  }`}>
                  {activeProductInstance.error.includes("Free tier allows one manual analysis") || activeProductInstance.error.includes("Free tier allows one new product investigation")
                    ? "Free Tier Notice"
                    : "Analysis Failed"}
                </h3>
                <p className={` font-roboto-mono ${activeProductInstance.error.includes("Free tier allows one manual analysis") || activeProductInstance.error.includes("Free tier allows one new product investigation")
                    ? "text-yellow-200"
                    : "text-red-200"
                  }`}>
                  {activeProductInstance.error}
                </p>
              </div>
            )}

            {activeProductInstance.hasSearched && !activeProductInstance.isLoading && !activeProductInstance.error && activeInstanceId && (
              <div className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                {activeProductInstance.productName && (!activeProductInstance.competitorProductName || selectedPlan !== 'max') && (
                  <ResultsDisplay 
                    issues={activeProductInstance.issues} 
                    productName={activeProductInstance.productName} 
                    onResolveIssue={handleResolveIssue}
                    selectedPlan={selectedPlan}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                    onGoToSubscription={handleGoToSubscription}
                  />
                )}
                
                <CompetitorControls 
                  key={`comp-${activeProductInstance.id}`} 
                  currentCompetitorName={activeProductInstance.competitorProductName}
                  onAnalyze={handleAnalyzeCompetitor}
                  onClear={handleClearCompetitor}
                  isLoading={activeProductInstance.isCompetitorLoading}
                  disabled={!activeInstanceId || !activeProductInstance.hasSearched}
                  selectedPlan={selectedPlan}
                  onGoToSubscription={handleGoToSubscription}
                />

                {selectedPlan === 'max' && activeProductInstance.competitorProductName && (
                  <ComparisonLayout
                    primaryProduct={{
                      name: activeProductInstance.productName || "Primary Product",
                      issues: activeProductInstance.issues,
                      onResolve: handleResolveIssue,
                      isLoading: activeProductInstance.isLoading,
                      error: activeProductInstance.error,
                      selectedPlan: selectedPlan,
                      onGoToSubscription: handleGoToSubscription
                    }}
                    competitorProduct={{
                      name: activeProductInstance.competitorProductName,
                      issues: activeProductInstance.competitorIssues,
                      onResolve: handleResolveCompetitorIssue,
                      isLoading: activeProductInstance.isCompetitorLoading,
                      error: activeProductInstance.competitorError,
                      selectedPlan: selectedPlan,
                      onGoToSubscription: handleGoToSubscription
                    }}
                  />
                )}
                 {selectedPlan !== 'max' && activeProductInstance.competitorProductName && (
                     <div className="my-6 p-4 bg-yellow-800/30 border border-yellow-700/50 rounded-lg text-center shadow-lg animate-slideDownAndFadeInTiny">
                        <h3 className="text-lg font-semibold text-yellow-300 mb-1 font-orbitron">Upgrade Required</h3>
                        <p className="text-yellow-300">Competitor analysis data for "{activeProductInstance.competitorProductName}" is hidden. Upgrade to Max Tier to view.</p>
                        <button
                            onClick={handleGoToSubscription}
                            className="mt-3 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 transition-colors text-sm"
                        >
                            Upgrade to Max Tier
                        </button>
                    </div>
                 )}
              </div>
            )}
            
            {activeProductInstance.isLoading && <div className="animate-fadeInUp"><LoadingSpinner /></div>}
            
            {activeInstanceId && activeProductInstance.productName && activeProductInstance.hasSearched && !activeProductInstance.isLoading && !activeProductInstance.error && (
              <div className="mt-8 text-center animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                <WeeklyScanTimer 
                  productName={activeProductInstance.productName} 
                  nextScanTimestamp={activeProductInstance.nextScanDue}
                  isScanning={false} 
                  selectedPlan={selectedPlan}
                  onGoToSubscription={handleGoToSubscription}
                />
              </div>
            )}
            {!activeInstanceId && draftInstanceData && !draftInstanceData.hasSearched && !draftInstanceData.isLoading && (
                 <div className="text-center py-12 px-4 animate-fadeInUp">
                    <DocumentMagnifyingGlassIcon className="w-20 h-20 mx-auto text-sky-500 mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-100 mb-3 font-orbitron">New Investigation Ready</h2>
                    <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
                        Enter a product name above to begin your analysis. Holmes is standing by.
                    </p>
                 </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 px-4 animate-fadeInUp">
            <DocumentMagnifyingGlassIcon className="w-20 h-20 mx-auto text-sky-500 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-100 mb-3 font-orbitron">Begin Your Investigation</h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto">
              No active product analysis. Click '+' in the header or enter a product name above to start.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
