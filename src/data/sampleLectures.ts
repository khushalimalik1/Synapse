import { LectureItem } from '../types/lecture';
import { IMAGES } from '../assets/images';

export const SAMPLE_LECTURES: LectureItem[] = [
  {
    id: 'lecture-neuro-101',
    title: 'Synaptic Transmission & Chemical Signaling',
    subject: 'Neuroscience & Physiology',
    courseCode: 'NEURO 101',
    instructor: 'Dr. Elena Vasquez',
    date: 'Nov 3, 2026',
    duration: '48 min',
    coverImage: IMAGES.neuroscience,
    status: 'ready',
    overview: {
      summary:
        'This lecture explores the mechanisms of electrochemical communication between neurons. We dissect the journey of an action potential reaching the presynaptic terminal, voltage-gated calcium influx, SNARE-mediated vesicle docking, neurotransmitter release into the 20nm synaptic cleft, and postsynaptic receptor activation (ionotropic vs. metabotropic).',
      keyTakeaways: [
        'Calcium influx via voltage-gated Ca²⁺ channels is the non-negotiable trigger for vesicle exocytosis.',
        'SNARE protein complexes (synaptobrevin, syntaxin, SNAP-25) mediate vesicle docking and membrane fusion.',
        'Ionotropic receptors mediate rapid milliseconds-scale EPSPs/IPSPs; metabotropic receptors trigger G-protein cascades with slower, long-lasting modulation.',
        'Signal termination relies on rapid enzymatic degradation (e.g., AChE) and high-affinity reuptake transporters.'
      ],
      estimatedStudyTime: '45 mins',
      difficulty: 'Intermediate',
      topics: [
        'Presynaptic Depolarization',
        'SNARE Complexes & Exocytosis',
        'Ionotropic vs Metabotropic Receptors',
        'EPSPs & IPSPs Summation',
        'Neurotransmitter Clearance'
      ]
    },
    transcript: [
      {
        id: 't-1',
        timestamp: '00:00',
        seconds: 0,
        speaker: 'Dr. Elena Vasquez',
        text: 'Good morning everyone. Today we are diving into one of the most critical topics on your midterm: synaptic transmission. Specifically, how an electrical impulse traveling down an axon transforms into a chemical signal.',
        topicTag: 'Introduction'
      },
      {
        id: 't-2',
        timestamp: '03:15',
        seconds: 195,
        speaker: 'Dr. Elena Vasquez',
        text: 'When the action potential arrives at the presynaptic axon terminal, it causes massive local depolarization. This voltage change triggers voltage-gated calcium channels to open. Calcium ions—Ca²⁺—flow down their steep electrochemical gradient into the cytoplasm.',
        topicTag: 'Calcium Influx'
      },
      {
        id: 't-3',
        timestamp: '08:40',
        seconds: 520,
        speaker: 'Dr. Elena Vasquez',
        text: 'Now pay close attention to this next step: intracellular calcium interacts directly with synaptotagmin, a calcium-sensor protein embedded in synaptic vesicle membranes. This activates the core SNARE complex.',
        topicTag: 'SNARE Complex'
      },
      {
        id: 't-4',
        timestamp: '14:20',
        seconds: 860,
        speaker: 'Marcus (Student)',
        text: 'Professor Vasquez, what are the three specific proteins that make up that core SNARE bundle again?',
        topicTag: 'Student Question'
      },
      {
        id: 't-5',
        timestamp: '15:05',
        seconds: 905,
        speaker: 'Dr. Elena Vasquez',
        text: 'Great question Marcus. The v-SNARE is synaptobrevin on the vesicle. The t-SNAREs on the target presynaptic membrane are syntaxin-1 and SNAP-25. Together, they zipper into a tight four-helix bundle that pulls the membranes together for pore fusion.',
        topicTag: 'SNARE Complex'
      },
      {
        id: 't-6',
        timestamp: '22:30',
        seconds: 1350,
        speaker: 'Dr. Elena Vasquez',
        text: 'Once released across the 20 to 40 nanometer synaptic cleft, neurotransmitters bind to postsynaptic receptors. We divide these into two fundamental classes: Ionotropic, which are ligand-gated ion channels that open almost instantly, and Metabotropic, which are G-protein coupled receptors that modulate intracellular second messengers like cAMP.',
        topicTag: 'Receptor Types'
      },
      {
        id: 't-7',
        timestamp: '32:10',
        seconds: 1930,
        speaker: 'Dr. Elena Vasquez',
        text: 'How does the synapse reset? You must stop the signal, or the post-synaptic cell will desensitize or suffer excitotoxicity. The two main clearance mechanisms are enzymatic breakdown, such as acetylcholinesterase cleaving acetylcholine, and active reuptake by presynaptic transporters and surrounding glial astrocytes.',
        topicTag: 'Signal Clearance'
      },
      {
        id: 't-8',
        timestamp: '42:50',
        seconds: 2570,
        speaker: 'Dr. Elena Vasquez',
        text: 'For Thursday: Review how Botox works. Botulinum toxin cleaves SNARE proteins, preventing acetylcholine release and causing flaccid paralysis. See you all in lab.',
        topicTag: 'Clinical Correlation'
      }
    ],
    rawTranscriptText: `Good morning everyone. Today we are diving into one of the most critical topics on your midterm: synaptic transmission. Specifically, how an electrical impulse traveling down an axon transforms into a chemical signal. When the action potential arrives at the presynaptic axon terminal, it causes massive local depolarization. This voltage change triggers voltage-gated calcium channels to open. Calcium ions—Ca²⁺—flow down their steep electrochemical gradient into the cytoplasm. Intracellular calcium interacts directly with synaptotagmin, a calcium-sensor protein embedded in synaptic vesicle membranes. This activates the core SNARE complex. The v-SNARE is synaptobrevin on the vesicle. The t-SNAREs on the target presynaptic membrane are syntaxin-1 and SNAP-25. Together, they zipper into a tight four-helix bundle that pulls the membranes together for pore fusion. Once released across the 20 to 40 nanometer synaptic cleft, neurotransmitters bind to postsynaptic receptors: Ionotropic (ligand-gated channels) and Metabotropic (G-protein coupled). Clearance occurs via enzymatic breakdown (AChE) and active reuptake via glial and presynaptic transporters. Clinical note: Botulinum toxin cleaves SNAREs, blocking ACh release.`,
    cornellNotes: [
      {
        id: 'cn-1',
        topic: 'Presynaptic Depolarization & Trigger',
        cue: 'What ions trigger vesicle release and why?',
        notes: [
          'Arrival of action potential at axon terminal depolarizes the presynaptic membrane.',
          'Opens Voltage-Gated Ca²⁺ Channels (VGCCs).',
          'Extracellular Ca²⁺ (~1-2 mM) enters cytoplasm where resting Ca²⁺ is tiny (~100 nM).',
          'Extremely steep chemical gradient ensures rapid inward rush.'
        ],
        formulasOrRules: ['[Ca²⁺]_extracellular (~1.2 mM) >> [Ca²⁺]_intracellular (~100 nM)'],
        timestampRef: '03:15'
      },
      {
        id: 'cn-2',
        topic: 'Vesicle Fusion Machinery (SNARE Complex)',
        cue: 'How does the SNARE pin complex physically force membrane fusion?',
        notes: [
          'Synaptotagmin acts as the primary Ca²⁺ sensor.',
          'v-SNARE: Synaptobrevin (VAMP) on vesicle membrane.',
          't-SNARE: Syntaxin-1 and SNAP-25 on target presynaptic terminal membrane.',
          'Zippering mechanism: 4-helix bundle winds together from N to C terminus, overcoming electrostatic repulsion of phospholipid bilayers.',
          'Clinical tie-in: Botulinum toxin & Tetanus toxin cleave specific SNARE proteins, abolishing neurotransmitter exocytosis.'
        ],
        formulasOrRules: ['Core SNARE = Synaptobrevin + Syntaxin-1 + SNAP-25 (2 helices)'],
        timestampRef: '08:40'
      },
      {
        id: 'cn-3',
        topic: 'Postsynaptic Receptors: Fast vs. Modulatory',
        cue: 'Contrast Ionotropic vs Metabotropic receptors in kinetics and mechanism.',
        notes: [
          'Ionotropic: Ligand-gated ion channels. Millisecond kinetics. Directly conducts Na⁺, K⁺, or Cl⁻. Examples: Nicotinic AChR, AMPA, NMDA, GABA_A.',
          'Metabotropic: 7-transmembrane GPCRs. Slower onset (hundreds of ms to seconds), amplified and long-lasting. Examples: Muscarinic AChR, mGluR, GABA_B.',
          'Excitatory Postsynaptic Potential (EPSP): Cation influx depolarizes cell toward threshold.',
          'Inhibitory Postsynaptic Potential (IPSP): Anion (Cl⁻) influx or K⁺ efflux hyperpolarizes cell.'
        ],
        formulasOrRules: ['Ionotropic = Direct Channel (ms)', 'Metabotropic = G-Protein Cascade (s/min)'],
        timestampRef: '22:30'
      },
      {
        id: 'cn-4',
        topic: 'Signal Inactivation & Homeostasis',
        cue: 'Why must neurotransmitters be cleared rapidly?',
        notes: [
          'Prevents receptor desensitization and excitotoxicity (e.g., glutamate excess killing neurons).',
          'Enzymatic Inactivation: Acetylcholinesterase (AChE) cleaves ACh into acetate + choline in the cleft.',
          'Active Reuptake: High-affinity presynaptic transporters (DAT, SERT, NET) and astrocyte uptake (GLT-1 for glutamate).'
        ],
        timestampRef: '32:10'
      }
    ],
    lectureSummary:
      'Synaptic transmission converts an electrical action potential into chemical release via voltage-gated Ca²⁺ influx and calcium-triggered SNARE zippering. Neurotransmitters activate fast ionotropic channels or modulating metabotropic GPCRs, and are rapidly cleared via enzymatic breakdown or glial/neuronal reuptake to preserve high temporal fidelity.',
    flashcards: [
      {
        id: 'fc-1',
        front: 'What ion is the indispensable trigger for synaptic vesicle exocytosis?',
        back: 'Calcium (Ca²⁺). Influx via voltage-gated calcium channels upon terminal depolarization.',
        topic: 'Presynaptic Events',
        difficulty: 'Easy',
        masteryStatus: 'mastered'
      },
      {
        id: 'fc-2',
        front: 'Which protein functions as the primary calcium sensor on synaptic vesicles?',
        back: 'Synaptotagmin. Upon binding Ca²⁺, it promotes full SNARE zippering and membrane fusion.',
        topic: 'Molecular Machinery',
        difficulty: 'Medium',
        masteryStatus: 'learning'
      },
      {
        id: 'fc-3',
        front: 'Name the three core proteins comprising the minimal SNARE fusion complex.',
        back: '1. Synaptobrevin (v-SNARE)\n2. Syntaxin-1 (t-SNARE)\n3. SNAP-25 (t-SNARE, contributes 2 alpha-helices)',
        topic: 'Molecular Machinery',
        difficulty: 'Hard',
        masteryStatus: 'unlearned'
      },
      {
        id: 'fc-4',
        front: 'What is the primary difference between ionotropic and metabotropic receptors?',
        back: 'Ionotropic receptors are direct ligand-gated ion channels (fast, ms response). Metabotropic receptors are GPCRs that act via intracellular secondary messenger cascades (slower, amplifiable, modulatory).',
        topic: 'Receptor Types',
        difficulty: 'Medium',
        masteryStatus: 'mastered'
      },
      {
        id: 'fc-5',
        front: 'How does Botulinum Toxin (Botox) cause flaccid muscle paralysis?',
        back: 'It functions as a protease that cleaves SNARE proteins (SNAP-25 / synaptobrevin), preventing acetylcholine exocytosis at neuromuscular junctions.',
        topic: 'Clinical Pharmacology',
        difficulty: 'Medium',
        masteryStatus: 'learning'
      },
      {
        id: 'fc-6',
        front: 'How is acetylcholine cleared from the synaptic cleft?',
        back: 'Rapid enzymatic degradation by Acetylcholinesterase (AChE) into choline and acetate. Choline is then taken back up by the presynaptic terminal.',
        topic: 'Signal Clearance',
        difficulty: 'Easy',
        masteryStatus: 'mastered'
      },
      {
        id: 'fc-7',
        front: 'What produces an Inhibitory Postsynaptic Potential (IPSP)?',
        back: 'Influx of chloride ions (Cl⁻) through GABA_A or Glycine channels, or efflux of potassium (K⁺), hyperpolarizing the postsynaptic membrane away from action potential threshold.',
        topic: 'Postsynaptic Potentials',
        difficulty: 'Medium',
        masteryStatus: 'unlearned'
      },
      {
        id: 'fc-8',
        front: 'What is the typical width of a chemical synaptic cleft?',
        back: 'Approximately 20 to 40 nanometers (nm), allowing diffusion within fractions of a millisecond.',
        topic: 'Anatomy',
        difficulty: 'Easy',
        masteryStatus: 'mastered'
      }
    ],
    quiz: [
      {
        id: 'q-1',
        question: 'Which of the following events happens FIRST when an action potential reaches the axon terminal?',
        options: [
          'Synaptotagmin binds intracellular calcium',
          'Depolarization activates voltage-gated Ca²⁺ channels',
          'SNARE pins zipper to pull the vesicle membrane',
          'Transmitters diffuse across the synaptic cleft'
        ],
        answerIndex: 1,
        explanation:
          'Terminal depolarization immediately activates voltage-gated Ca²⁺ channels, initiating the inward flow of calcium that subsequently binds synaptotagmin and triggers SNARE fusion.',
        topic: 'Presynaptic Sequence'
      },
      {
        id: 'q-2',
        question: 'Which component is classified as a v-SNARE located directly on the synaptic vesicle membrane?',
        options: ['Syntaxin-1', 'SNAP-25', 'Synaptobrevin (VAMP)', 'Neurexin'],
        answerIndex: 2,
        explanation:
          'Synaptobrevin (also called VAMP) is the v-SNARE on the vesicle. Syntaxin-1 and SNAP-25 are t-SNAREs embedded in the target plasma membrane.',
        topic: 'Molecular Biology'
      },
      {
        id: 'q-3',
        question: 'If a researcher applies an antagonist that blocks GPCR alpha subunits, which receptor type is selectively inhibited?',
        options: [
          'Ionotropic AMPA receptor',
          'Metabotropic receptor',
          'Nicotinic acetylcholine receptor',
          'Voltage-gated sodium channel'
        ],
        answerIndex: 1,
        explanation:
          'Metabotropic receptors are G-protein coupled receptors (GPCRs) that depend on heterotrimeric G-protein alpha/beta/gamma signaling cascades.',
        topic: 'Receptor Pharmacology'
      },
      {
        id: 'q-4',
        question: 'Why does severe inhibition of Acetylcholinesterase (e.g. by organophosphate nerve agents) cause muscle spasms and paralysis?',
        options: [
          'It destroys acetylcholine molecules before they reach receptors',
          'Excess acetylcholine accumulates in the cleft, causing continuous depolarizing block and receptor desensitization',
          'It blocks calcium channels in the presynaptic terminal',
          'It forces synaptic vesicles to degrade prematurely'
        ],
        answerIndex: 1,
        explanation:
          'Without AChE breakdown, acetylcholine lingers indefinitely in the synaptic cleft, continuously opening receptors, resulting in tetanic contraction followed by receptor desensitization and flaccid paralysis.',
        topic: 'Toxicology & Clearance'
      },
      {
        id: 'q-5',
        question: 'Temporal summation occurs when:',
        options: [
          'Multiple distinct synapses fire simultaneously at different dendritic locations',
          'A single presynaptic terminal fires repeated action potentials in rapid succession',
          'Astrocytes release glutamate directly into the extrasynaptic space',
          'SNARE complexes fail to dissociate following vesicle fusion'
        ],
        answerIndex: 1,
        explanation:
          'Temporal summation is the additive effect of successive postsynaptic potentials generated by repetitive firing of a single synapse in close temporal proximity.',
        topic: 'Postsynaptic Integration'
      }
    ],
    glossary: [
      {
        id: 'g-1',
        term: 'Synaptotagmin',
        definition: 'A specialized calcium-sensor protein with C2 domains embedded in synaptic vesicles.',
        context: 'Acts as the molecular switch that converts Ca²⁺ influx into instantaneous vesicle fusion.'
      },
      {
        id: 'g-2',
        term: 'SNARE Complex',
        definition: 'Soluble N-ethylmaleimide-sensitive factor attachment protein receptor complex.',
        context: 'The mechanical engine (synaptobrevin + syntaxin-1 + SNAP-25) that zips together to merge lipid membranes.'
      },
      {
        id: 'g-3',
        term: 'EPSP vs. IPSP',
        definition: 'Excitatory vs. Inhibitory Postsynaptic Potentials.',
        context: 'Graded membrane potential changes that move the postsynaptic neuron closer to (EPSP) or farther from (IPSP) action potential threshold.'
      },
      {
        id: 'g-4',
        term: 'Acetylcholinesterase (AChE)',
        definition: 'A high-velocity hydrolytic enzyme located in the synaptic cleft and basal lamina.',
        context: 'Cleaves acetylcholine into choline and acetate within sub-milliseconds to terminate cholinergic signaling.'
      }
    ],
    cheatSheet: {
      highYieldPoints: [
        'Ca²⁺ entry through VGCCs is mandatory: No Ca²⁺ = No release.',
        'SNARE 4-helix bundle: 1 from Synaptobrevin, 1 from Syntaxin, 2 from SNAP-25.',
        'Ionotropic = Fast, channel-intrinsic. Metabotropic = Modulatory, GPCR/2nd messenger.',
        'Summation: Spatial = different locations; Temporal = same location, high frequency.'
      ],
      commonPitfalls: [
        'Confusing Synaptotagmin (calcium sensor) with Synaptobrevin (v-SNARE fusion protein).',
        'Thinking neurotransmitter crosses the cleft via active transport (it diffuses passively).',
        'Forgetting that SNAP-25 contributes TWO alpha helices, not one.'
      ],
      examTips: [
        'Always look for Botox on tests: it cleaves SNAREs, blocking ACh exocytosis.',
        'Remember that IPSPs typically involve Cl⁻ influx, which shifts Vm toward -70mV or -75mV.'
      ],
      coreFormulas: [
        'Nernst Potential: E_ion = (RT / zF) * ln([Ion]_out / [Ion]_in)',
        'Ohm’s Law in membrane currents: I_ion = g_ion * (V_m - E_ion)'
      ]
    }
  },
  {
    id: 'lecture-cs-229',
    title: 'Gradient Descent, Convexity & Loss Landscapes',
    subject: 'Machine Learning',
    courseCode: 'CS 229',
    instructor: 'Prof. Andrew Rivera',
    date: 'Nov 1, 2026',
    duration: '52 min',
    coverImage: IMAGES.machineLearning,
    status: 'ready',
    overview: {
      summary:
        'A mathematical breakdown of first-order optimization in machine learning. We formulate loss functions as geometric energy surfaces, evaluate Lipschitz smoothness and Hessian convexity, compare Batch vs. Stochastic Gradient Descent, and examine modern adaptive momentum optimizers (Adam and RMSProp).',
      keyTakeaways: [
        'The gradient ∇J(θ) points in the direction of steepest ascent; updating with -α∇J(θ) guarantees descent under Lipschitz conditions.',
        'Strict convexity guarantees that every local minimum is the unique global minimum.',
        'Stochastic Gradient Descent (SGD) introduces gradient noise that prevents trapping in shallow local saddles.',
        'Momentum and Adam accelerate convergence along flat valley ravines while damping orthogonal oscillations.'
      ],
      estimatedStudyTime: '50 mins',
      difficulty: 'Advanced',
      topics: [
        'Objective Function Formulation',
        'First-Order Taylor Approximation',
        'Learning Rate & Lipschitz Smoothness',
        'SGD vs Mini-Batch Dynamics',
        'Adaptive Optimizers (Adam, Momentum)'
      ]
    },
    transcript: [
      {
        id: 'ml-t-1',
        timestamp: '00:00',
        seconds: 0,
        speaker: 'Prof. Andrew Rivera',
        text: 'Welcome back. Today we transition from modeling to optimization. How do we actually fit millions of parameters when analytical closed-form solutions are impossible?',
        topicTag: 'Introduction'
      },
      {
        id: 'ml-t-2',
        timestamp: '04:20',
        seconds: 260,
        speaker: 'Prof. Andrew Rivera',
        text: 'Consider an empirical risk objective J of theta. The gradient vector ∇J(theta) is the vector of all partial derivatives. By definition of the directional derivative, ∇J points in the direction of maximum rate of increase. Therefore, stepping in the negative gradient direction decreases the loss.',
        topicTag: 'Gradient Vector'
      },
      {
        id: 'ml-t-3',
        timestamp: '12:45',
        seconds: 765,
        speaker: 'Sarah (Student)',
        text: 'Professor, how do we know our learning rate alpha will not overshoot the valley and explode?',
        topicTag: 'Student Question'
      },
      {
        id: 'ml-t-4',
        timestamp: '13:30',
        seconds: 810,
        speaker: 'Prof. Andrew Rivera',
        text: 'That brings us to the Descent Lemma. If the gradient is L-Lipschitz continuous, setting your step size alpha strictly less than 2 over L guarantees cost decrease at each iteration.',
        topicTag: 'Descent Lemma'
      },
      {
        id: 'ml-t-5',
        timestamp: '25:10',
        seconds: 1510,
        speaker: 'Prof. Andrew Rivera',
        text: 'In true deep learning, computing the full batch gradient over 10 million training examples is computationally suicidal. Instead, we use Mini-batch SGD. The stochastic gradient is an unbiased estimator of the true gradient, with expectation equal to the full population gradient.',
        topicTag: 'Stochastic Gradient'
      },
      {
        id: 'ml-t-6',
        timestamp: '38:00',
        seconds: 2280,
        speaker: 'Prof. Andrew Rivera',
        text: 'Finally, notice how standard SGD oscillates wildly in ravines where curvature is high in one dimension and low in another. Momentum adds a velocity vector with a decay factor beta, smoothing high-frequency chatter and accelerating through flat plateaus.',
        topicTag: 'Momentum & Adam'
      }
    ],
    rawTranscriptText: `Welcome back. Today we transition from modeling to optimization. How do we actually fit millions of parameters when analytical closed-form solutions are impossible? Consider an empirical risk objective J of theta. The gradient vector ∇J(theta) is the vector of all partial derivatives. By definition of the directional derivative, ∇J points in the direction of maximum rate of increase. Therefore, stepping in the negative gradient direction decreases the loss. If the gradient is L-Lipschitz continuous, setting your step size alpha strictly less than 2/L guarantees cost decrease at each iteration by the Descent Lemma. In true deep learning, computing full batch gradient is computationally suicidal. Mini-batch SGD provides an unbiased estimator of the population gradient. Momentum smooths ravines by maintaining an exponential moving average of past gradients.`,
    cornellNotes: [
      {
        id: 'ml-cn-1',
        topic: 'Gradient Update & Geometric Intuition',
        cue: 'Why does moving along -∇J guarantee descent for small α?',
        notes: [
          'Gradient vector: ∇J(θ) = [∂J/∂θ₁, ∂J/∂θ₂, ..., ∂J/∂θ_d]^T.',
          'Directional derivative in unit direction u is D_u J = ∇J · u = ||∇J|| cos(φ).',
          'Minimization occurs when cos(φ) = -1 (direction opposite to ∇J).',
          'Standard parameter update: θ_{t+1} = θ_t - α ∇J(θ_t).'
        ],
        formulasOrRules: ['θ_{t+1} = θ_t - α ∇J(θ_t)'],
        timestampRef: '04:20'
      },
      {
        id: 'ml-cn-2',
        topic: 'Lipschitz Smoothness & Step Size Bound',
        cue: 'What mathematical condition bounds the maximum stable learning rate?',
        notes: [
          'L-Lipschitz gradient condition: ||∇J(x) - ∇J(y)|| ≤ L ||x - y||.',
          'Descent Lemma: J(y) ≤ J(x) + ∇J(x)^T (y - x) + (L/2) ||y - x||².',
          'Substituting y = x - α ∇J(x) gives: J(x - α∇J(x)) ≤ J(x) - α(1 - αL/2) ||∇J(x)||².',
          'Maximum stable learning rate: α < 2 / L. Optimal fixed step size: α = 1 / L.'
        ],
        formulasOrRules: ['α_optimal = 1 / L', 'Stability constraint: 0 < α < 2 / L'],
        timestampRef: '13:30'
      },
      {
        id: 'ml-cn-3',
        topic: 'SGD vs. Full Batch & Convergence',
        cue: 'Why is mini-batch SGD preferred over full-batch descent?',
        notes: [
          'Full-Batch GD: O(N) cost per step. Deterministic, smooth trajectories, but easily gets stuck in bad saddle points.',
          'SGD: Computes gradient on batch B: g_t = (1/|B|) ∑_{i ∈ B} ∇J_i(θ_t).',
          'Unbiased Estimator: E[g_t] = ∇J(θ_t).',
          'Variance acts as implicit regularizer, escaping sharp local minima toward broader, flatter basins.'
        ],
        formulasOrRules: ['E[g_t] = ∇J(θ_t) (Unbiased Gradient Property)'],
        timestampRef: '25:10'
      },
      {
        id: 'ml-cn-4',
        topic: 'Momentum & Adam Optimizer',
        cue: 'How does Adam combine First and Second Moments?',
        notes: [
          'Momentum: v_t = γ v_{t-1} + α ∇J(θ_t). Accumulates velocity in persistent directions.',
          'Adam maintains exponential moving average of gradients (m_t) and squared gradients (v_t).',
          'Bias correction handles initialization at zero: m̂_t = m_t / (1 - β₁^t), v̂_t = v_t / (1 - β₂^t).',
          'Final update: θ_{t+1} = θ_t - (α / (√v̂_t + ε)) m̂_t.'
        ],
        formulasOrRules: ['Adam update: θ_{t+1} = θ_t - (α / (√v̂_t + ε)) · m̂_t'],
        timestampRef: '38:00'
      }
    ],
    lectureSummary:
      'Gradient descent navigates loss geometry by iterative orthogonal updates along the negative gradient. Convergence and stability are governed by Lipschitz continuity (requiring α < 2/L). Mini-batch SGD provides computational scalability and stochastic regularization, while adaptive optimizers like Adam normalize gradient scale across poorly conditioned dimensions.',
    flashcards: [
      {
        id: 'ml-fc-1',
        front: 'What does the gradient vector ∇J(θ) represent geometrically?',
        back: 'The direction of steepest rate of increase of the scalar objective function J. Its magnitude represents the rate of slope.',
        topic: 'Foundations',
        difficulty: 'Easy',
        masteryStatus: 'mastered'
      },
      {
        id: 'ml-fc-2',
        front: 'Under L-Lipschitz smoothness, what is the maximum learning rate α before divergence occurs?',
        back: 'α must be strictly less than 2 / L (α < 2/L). The optimal fixed step size is α = 1/L.',
        topic: 'Descent Theory',
        difficulty: 'Hard',
        masteryStatus: 'learning'
      },
      {
        id: 'ml-fc-3',
        front: 'Why is the mini-batch gradient considered an "unbiased estimator"?',
        back: 'Because its mathematical expectation equals the exact full dataset gradient: E[∇J_batch(θ)] = ∇J_full(θ).',
        topic: 'SGD Dynamics',
        difficulty: 'Medium',
        masteryStatus: 'mastered'
      },
      {
        id: 'ml-fc-4',
        front: 'What two quantities does Adam compute exponential moving averages of?',
        back: '1. First moment (mean of gradient, m_t)\n2. Second uncentered moment (variance/squared gradient, v_t)',
        topic: 'Optimizers',
        difficulty: 'Medium',
        masteryStatus: 'learning'
      },
      {
        id: 'ml-fc-5',
        front: 'What is the role of the epsilon (ε) term in the Adam update equation?',
        back: 'A small positive constant (typically 1e-8) added to the denominator to prevent division by zero when gradients are near zero.',
        topic: 'Numerical Stability',
        difficulty: 'Easy',
        masteryStatus: 'mastered'
      }
    ],
    quiz: [
      {
        id: 'ml-q-1',
        question: 'If a loss function J(θ) is strictly convex and twice continuously differentiable everywhere, what is true about its Hessian matrix ∇²J(θ)?',
        options: [
          'The Hessian has at least one negative eigenvalue',
          'The Hessian is symmetric positive definite (all eigenvalues > 0)',
          'The Hessian determinant is strictly zero',
          'The Hessian is an upper triangular matrix'
        ],
        answerIndex: 1,
        explanation:
          'Strict convexity for C² functions is equivalent to the Hessian matrix being positive definite (v^T H v > 0 for all v ≠ 0), guaranteeing a single unique global minimum.',
        topic: 'Convex Analysis'
      },
      {
        id: 'ml-q-2',
        question: 'What is the primary motivation for performing bias correction in the Adam optimizer?',
        options: [
          'To penalize large weights like L2 regularization',
          'Because initial moment vectors m₀ and v₀ are initialized to zero, causing estimates to be biased toward zero in initial iterations',
          'To eliminate the learning rate hyperparameter entirely',
          'To ensure gradients always point toward the origin'
        ],
        answerIndex: 1,
        explanation:
          'Since m_0 and v_0 are initialized as zero vectors, dividing by (1 - β^t) inflates early values so that expectations match the true initial moments.',
        topic: 'Adam Mechanics'
      },
      {
        id: 'ml-q-3',
        question: 'In an anisotropic loss landscape with a steep narrow ravine, standard Gradient Descent tends to:',
        options: [
          'Converge in exactly 1 iteration',
          'Oscillate violently across the steep walls while making negligible forward progress along the base',
          'Naturally accelerate due to curvature cancellation',
          'Instantly vanish due to ReLU saturation'
        ],
        answerIndex: 1,
        explanation:
          'When Hessian condition numbers are high, orthogonal components experience conflicting gradients, causing cross-ravine thrashing rather than progress along the valley floor.',
        topic: 'Ill-Conditioning'
      }
    ],
    glossary: [
      {
        id: 'ml-g-1',
        term: 'Lipschitz Continuity',
        definition: 'A smoothness property bounding how fast a function or its derivative can change: ||f(x) - f(y)|| ≤ L ||x - y||.',
        context: 'Used to establish theoretical step-size guarantees that prevent gradient divergence.'
      },
      {
        id: 'ml-g-2',
        term: 'Hessian Matrix',
        definition: 'Square matrix of second-order partial derivatives of a scalar-valued function.',
        context: 'Describes local surface curvature and determines whether a critical point is a minimum, maximum, or saddle.'
      },
      {
        id: 'ml-g-3',
        term: 'Condition Number',
        definition: 'Ratio of the maximum to minimum eigenvalues of the Hessian matrix (λ_max / λ_min).',
        context: 'High condition numbers indicate severe elongation/ravines, slowing first-order gradient descent.'
      }
    ],
    cheatSheet: {
      highYieldPoints: [
        'Descent guarantee: α < 2/L on L-Lipschitz functions.',
        'SGD gradient noise helps escape shallow local saddles.',
        'Adam = Momentum (1st moment) + RMSprop (2nd moment) + Bias Correction.',
        'Convex loss means any stationary point (∇J = 0) is a global minimum.'
      ],
      commonPitfalls: [
        'Setting learning rate too high (causes explosive loss to NaN).',
        'Forgetting bias correction factors (1 - β^t) in hand calculations.',
        'Confusing local convexity with global convexity.'
      ],
      examTips: [
        'On exams, always verify if Hessian determinant > 0 and trace > 0 for 2D local minimum test.',
        'Remember that SGD has O(1) step cost relative to training set size N.'
      ]
    }
  },
  {
    id: 'lecture-law-204',
    title: 'First Amendment: Commercial Speech & Central Hudson',
    subject: 'Constitutional Law',
    courseCode: 'LAW 204',
    instructor: 'Prof. Jonathan Vance',
    date: 'Oct 28, 2026',
    duration: '45 min',
    coverImage: IMAGES.constitutionalLaw,
    status: 'ready',
    overview: {
      summary:
        'An in-depth analysis of First Amendment protection afforded to commercial expression. We chart the constitutional evolution from Valentine v. Chrestensen (zero protection) through Virginia Pharmacy Board (informational consumer value) to the contemporary four-prong Central Hudson intermediate scrutiny framework.',
      keyTakeaways: [
        'Commercial speech is defined as speech that does no more than propose a commercial transaction.',
        'Central Hudson established intermediate scrutiny: 1) lawful/non-misleading, 2) substantial government interest, 3) directly advances interest, 4) not more extensive than necessary.',
        'False or deceptive commercial speech receives zero First Amendment protection.',
        'Recent Supreme Court jurisprudence (Sorrell, Reed) has pushed commercial speech closer toward strict scrutiny when regulations are content-based.'
      ],
      estimatedStudyTime: '40 mins',
      difficulty: 'Intermediate',
      topics: [
        'Evolution from Valentine to Virginia Pharmacy',
        'Central Hudson Four-Prong Test',
        'Substantial Interest vs Strict Scrutiny',
        'Tailoring & "Reasonable Fit"',
        'Compulsory Disclosures (Zauderer)'
      ]
    },
    transcript: [
      {
        id: 'law-t-1',
        timestamp: '00:00',
        seconds: 0,
        speaker: 'Prof. Jonathan Vance',
        text: 'Good afternoon. Today we confront one of the most commercially consequential arenas of constitutional doctrine: does the First Amendment protect an advertisement for prescription drugs or billboard signage?',
        topicTag: 'Introduction'
      },
      {
        id: 'law-t-2',
        timestamp: '06:15',
        seconds: 375,
        speaker: 'Prof. Jonathan Vance',
        text: 'Until the 1970s, the answer was a flat no under Valentine v. Chrestensen. That shifted dramatically in Virginia State Board of Pharmacy in 1976. Justice Blackmun recognized that consumers have a profound economic interest in the free flow of commercial information.',
        topicTag: 'Historical Shift'
      },
      {
        id: 'law-t-3',
        timestamp: '18:20',
        seconds: 1100,
        speaker: 'Prof. Jonathan Vance',
        text: 'Then in 1980 came Central Hudson Gas & Electric Corp. v. Public Service Commission. The court synthesized an intermediate scrutiny four-prong test that controls this entire field of law.',
        topicTag: 'Central Hudson Test'
      },
      {
        id: 'law-t-4',
        timestamp: '28:40',
        seconds: 1720,
        speaker: 'Rachel (Student)',
        text: 'Under prong four, does the government have to use the least restrictive means possible, like in strict scrutiny?',
        topicTag: 'Student Question'
      },
      {
        id: 'law-t-5',
        timestamp: '29:15',
        seconds: 1755,
        speaker: 'Prof. Jonathan Vance',
        text: 'Crucial distinction, Rachel: No. In Board of Trustees of SUNY v. Fox, the Court clarified that prong four requires a "reasonable fit"—not the single least restrictive measure, but one narrowly tailored to achieve the desired objective.',
        topicTag: 'Prong 4 Analysis'
      }
    ],
    rawTranscriptText: `Good afternoon. Today we confront First Amendment protection for commercial expression. Historically, Valentine v. Chrestensen afforded zero protection. In 1976, Virginia State Board of Pharmacy established that consumers hold a vital interest in accurate pricing and drug information. Central Hudson in 1980 codified intermediate scrutiny: 1) Is the speech lawful and non-misleading? 2) Is the asserted government interest substantial? 3) Does the regulation directly and materially advance that interest? 4) Is it not more extensive than necessary? Under SUNY v. Fox, prong four requires a reasonable fit, not the strict scrutiny least restrictive means test.`,
    cornellNotes: [
      {
        id: 'law-cn-1',
        topic: 'Constitutional History of Commercial Speech',
        cue: 'How did the Supreme Court shift from zero protection to intermediate scrutiny?',
        notes: [
          'Valentine v. Chrestensen (1942): Commercial advertising excluded from 1st Amendment protection.',
          'Bigelow v. Virginia (1975): Abortion clinic advertisement contained factual material of clear public interest.',
          'Virginia State Board of Pharmacy (1976): Landmark case holding that purely commercial price advertising of prescription pharmaceuticals is protected; consumers need accurate market data to allocate resources intelligently.'
        ],
        timestampRef: '06:15'
      },
      {
        id: 'law-cn-2',
        topic: 'The Central Hudson 4-Prong Framework',
        cue: 'Memorize the exact 4 prongs of the Central Hudson test.',
        notes: [
          'Prong 1 (Threshold): Speech must concern lawful activity and not be false or misleading. (If misleading -> zero protection!).',
          'Prong 2: Asserted governmental interest must be "substantial".',
          'Prong 3: Regulation must "directly and materially advance" that asserted interest (cannot rely on speculation or conjecture).',
          'Prong 4: Regulation must not be more extensive than necessary to serve that interest ("reasonable fit", SUNY v. Fox).'
        ],
        formulasOrRules: [
          'Prong 1: Lawful & Non-misleading',
          'Prong 2: Substantial Interest',
          'Prong 3: Direct Advancement',
          'Prong 4: Reasonable Fit (Narrow Tailoring)'
        ],
        timestampRef: '18:20'
      },
      {
        id: 'law-cn-3',
        topic: 'Compelled Commercial Speech & Disclosures',
        cue: 'What standard governs mandatory warning labels and disclosures?',
        notes: [
          'Zauderer v. Office of Disciplinary Counsel (1985).',
          'Standard of review: Highly deferential rational basis review IF disclosure is purely factual and uncontroversial.',
          'Example: Warning label "Cigarettes cause cancer" or nutritional calorie counts.',
          'Cannot force companies to endorse subjective ideological viewpoints (NIFLA v. Becerra).'
        ],
        timestampRef: '35:00'
      }
    ],
    lectureSummary:
      'Commercial speech occupies an intermediate tier of constitutional protection. Under the Central Hudson test, lawful, truthful advertising can only be restricted if the government proves a substantial interest directly advanced by a reasonably fitted, non-excessive regulation. Deceptive speech receives zero protection, while purely factual mandatory disclosures are evaluated under Zauderer.',
    flashcards: [
      {
        id: 'law-fc-1',
        front: 'What is the canonical definition of "commercial speech"?',
        back: 'Speech that does no more than propose a commercial transaction, or speech motivated primarily by economic marketing interests.',
        topic: 'Definitions',
        difficulty: 'Easy',
        masteryStatus: 'mastered'
      },
      {
        id: 'law-fc-2',
        front: 'What happens at Prong 1 of the Central Hudson test if commercial speech is fraudulent or misleading?',
        back: 'It receives ZERO First Amendment protection; the government may ban it outright without satisfying the remaining 3 prongs.',
        topic: 'Central Hudson',
        difficulty: 'Medium',
        masteryStatus: 'mastered'
      },
      {
        id: 'law-fc-3',
        front: 'Does Prong 4 of Central Hudson require the government to choose the "least restrictive means"?',
        back: 'NO. Board of Trustees of SUNY v. Fox clarified that it requires a "reasonable fit"—proportionate to the interest served, not necessarily the single least restrictive alternative.',
        topic: 'Scrutiny Standards',
        difficulty: 'Hard',
        masteryStatus: 'learning'
      },
      {
        id: 'law-fc-4',
        front: 'What case established that purely factual, uncontroversial compelled commercial disclosures face rational basis review?',
        back: 'Zauderer v. Office of Disciplinary Counsel (1985).',
        topic: 'Compelled Speech',
        difficulty: 'Hard',
        masteryStatus: 'unlearned'
      }
    ],
    quiz: [
      {
        id: 'law-q-1',
        question: 'Under Central Hudson, which of the following burdens must the government meet to satisfy Prong 3 (direct advancement)?',
        options: [
          'It must demonstrate plausible speculation that the ban might assist commerce',
          'It must prove the regulation directly and materially alleviates the asserted harm, supported by empirical evidence or history',
          'It must prove beyond a reasonable doubt that no other state has implemented a similar ban',
          'It must obtain unanimous consent from the Federal Trade Commission'
        ],
        answerIndex: 1,
        explanation:
          'Prong 3 requires affirmative demonstration that harms are real and restrictions will alleviate them in a material degree, rejecting mere speculation (Edenfield v. Fane).',
        topic: 'Central Hudson'
      },
      {
        id: 'law-q-2',
        question: 'In Virginia State Board of Pharmacy, on what primary basis did the Court extend First Amendment protection to prescription drug price ads?',
        options: [
          'The corporate personhood doctrine of the 14th Amendment',
          'The strong consumer and societal interest in the free dissemination of truthful economic information',
          'The Commerce Clause exclusively',
          'The Right to Privacy under Griswold'
        ],
        answerIndex: 1,
        explanation:
          'Justice Blackmun wrote that society has a strong interest in the free flow of commercial information, often keener than interests in political debates for daily sustenance.',
        topic: 'Jurisprudence'
      }
    ],
    glossary: [
      {
        id: 'law-g-1',
        term: 'Intermediate Scrutiny',
        definition: 'A judicial review standard less demanding than strict scrutiny but more rigorous than rational basis review.',
        context: 'Applied to content-based commercial speech restrictions under Central Hudson.'
      },
      {
        id: 'law-g-2',
        term: 'Reasonable Fit',
        definition: 'A degree of fit between government goal and means that is not necessarily perfect or least restrictive, but in sound proportion.',
        context: 'Established in SUNY v. Fox as the operative metric for Central Hudson prong four.'
      }
    ],
    cheatSheet: {
      highYieldPoints: [
        'Prong 1 is a gatekeeper: Fraudulent speech is completely unprotected.',
        'Prong 2: Government interest must be substantial (not compelling).',
        'Prong 3: Must directly advance; no speculation.',
        'Prong 4: Reasonable fit, not least restrictive means.'
      ],
      commonPitfalls: [
        'Confusing intermediate scrutiny (Central Hudson) with strict scrutiny (Reed v. Town of Gilbert).',
        'Asserting that truthful commercial advertising can be banned because the product itself is legal.'
      ],
      examTips: [
        'Always test Prong 1 first: If deceptive advertising, analysis stops immediately!'
      ]
    }
  },
  {
    id: 'lecture-yt-mit-6006',
    title: 'Introduction to Algorithms, Peak Finding & Complexity',
    subject: 'Computer Science & Algorithms',
    courseCode: 'MIT 6.006',
    instructor: 'Prof. Erik Demaine & Prof. Srini Devadas',
    date: 'Nov 4, 2026',
    duration: '49 min',
    youtubeId: 'ZA-tUyM_y7s',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZA-tUyM_y7s',
    coverImage: 'https://img.youtube.com/vi/ZA-tUyM_y7s/hqdefault.jpg',
    status: 'ready',
    overview: {
      summary:
        'The foundational lecture of MIT 6.006: Introduction to Algorithms. Professors Erik Demaine and Srini Devadas introduce the core philosophy of efficient computation, formalizing the 1D and 2D Peak Finding problems to demonstrate how divide-and-conquer reduces linear O(n) search to logarithmic O(log n) time.',
      keyTakeaways: [
        'An algorithm is a formal, step-by-step procedure to solve a computational problem efficiently.',
        '1D Peak Finding: Straightforward linear scan requires Θ(n) comparisons; divide-and-conquer binary search finds a peak in Θ(log n).',
        '2D Peak Finding: A naive greedy ascent can degenerate to Θ(nm); divide-and-conquer on columns combined with global 1D maximum reduces complexity to Θ(n log m).',
        'Asymptotic analysis (Big-O, Big-Omega, Big-Theta) evaluates scaling behavior independent of programming language or hardware constants.'
      ],
      estimatedStudyTime: '45 mins',
      difficulty: 'Intermediate',
      topics: [
        'Definition of Peak Element',
        '1D Divide-and-Conquer Algorithm',
        'Recurrence Relations & Master Method',
        '2D Matrix Peak Finding Pitfalls',
        'Asymptotic Notation (O, Ω, Θ)'
      ]
    },
    transcript: [
      {
        id: 'mit-t-1',
        timestamp: '00:00',
        seconds: 0,
        speaker: 'Prof. Erik Demaine',
        text: 'Welcome to 6.006, Introduction to Algorithms! This course is all about efficiency: how to solve computational problems not just correctly, but blindingly fast at scale.',
        topicTag: 'Course Orientation'
      },
      {
        id: 'mit-t-2',
        timestamp: '04:15',
        seconds: 255,
        speaker: 'Prof. Srini Devadas',
        text: 'Let us begin with a toy problem: Peak Finding. In a 1-dimensional array of numbers A[1...n], position i is defined as a peak if and only if A[i] is greater than or equal to both its immediate neighbors, A[i-1] and A[i+1]. For boundary items, we only check the single existing neighbor.',
        topicTag: 'Peak Definition'
      },
      {
        id: 'mit-t-3',
        timestamp: '12:30',
        seconds: 750,
        speaker: 'Prof. Srini Devadas',
        text: 'If we walk linearly from left to right, worst-case time is Theta of n. If n is 10 million, that is 10 million steps. Can we do better? Yes! Look at the middle element, n over 2. If it is smaller than its left neighbor, we know a peak must exist somewhere in the left half!',
        topicTag: '1D Divide & Conquer'
      },
      {
        id: 'mit-t-4',
        timestamp: '21:40',
        seconds: 1300,
        speaker: 'Prof. Erik Demaine',
        text: 'The recurrence relation for this divide-and-conquer strategy is T(n) = T(n/2) + Theta(1). Applying the Master Theorem, this solves cleanly to Theta of log base 2 of n. For 10 million elements, that is approximately 24 comparisons instead of 10 million!',
        topicTag: 'Recurrence Analysis'
      },
      {
        id: 'mit-t-5',
        timestamp: '34:20',
        seconds: 2060,
        speaker: 'Prof. Srini Devadas',
        text: 'Now consider the 2D version: an n by m matrix. A point is a peak if it is greater than or equal to its top, bottom, left, and right neighbors. Beware: a naive 2D algorithm that divides by rows and columns greedily can loop or degrade into linear search. The correct approach finds the global maximum of column j in O(n) time, then compares against horizontal neighbors.',
        topicTag: '2D Peak Finding'
      }
    ],
    rawTranscriptText: `Welcome to 6.006, Introduction to Algorithms. This course is about efficiency and scalability. We begin with 1D Peak Finding: an element A[i] is a peak if A[i] >= A[i-1] and A[i] >= A[i+1]. A linear scan takes Θ(n) time. By using divide-and-conquer: examine middle element n/2; if A[n/2] < A[n/2 - 1], recurse on left half; else if A[n/2] < A[n/2 + 1], recurse on right half; else middle is a peak. The recurrence T(n) = T(n/2) + O(1) yields Θ(log n). In 2D, finding the global column maximum in O(n) and recursing horizontally yields T(n, m) = T(n, m/2) + O(n), which solves to Θ(n log m).`,
    cornellNotes: [
      {
        id: 'mit-cn-1',
        topic: '1D Peak Definition & Invariants',
        cue: 'What is the exact definition of a 1D peak, and why is existence guaranteed?',
        notes: [
          'Definition: A[i] is a peak iff A[i] ≥ A[i-1] (if i > 1) and A[i] ≥ A[i+1] (if i < n).',
          'Notice the inequality is weak (≥), meaning flat plateaus satisfy the definition.',
          'Existence is guaranteed: the global maximum of the entire array is always a valid peak.',
          'Goal: We do NOT need to find the global maximum; finding ANY local peak satisfies the problem.'
        ],
        formulasOrRules: ['Peak Invariant: A[i] ≥ A[i-1] ∧ A[i] ≥ A[i+1]'],
        timestampRef: '04:15'
      },
      {
        id: 'mit-cn-2',
        topic: 'Divide-and-Conquer Recurrence',
        cue: 'Prove why recursing toward a strictly larger neighbor guarantees finding a peak.',
        notes: [
          'Middle element: index m = ⌊n/2⌋.',
          'If A[m-1] > A[m], then the sub-array A[1...m-1] must contain at least one peak. Why? Because either the global maximum of that left half is internal, or it is at A[m-1] which is strictly greater than A[m].',
          'Recurrence: T(n) = T(n/2) + c (constant work c to compare with 2 neighbors).',
          'Base case: T(1) = O(1).',
          'Solution: T(n) = c · log₂(n) = Θ(log n).'
        ],
        formulasOrRules: ['T(n) = T(n/2) + Θ(1) ⇒ T(n) = Θ(log n)'],
        timestampRef: '21:40'
      },
      {
        id: 'mit-cn-3',
        topic: '2D Peak Finding Algorithm',
        cue: 'What is the correct 2D divide-and-conquer strategy and its complexity?',
        notes: [
          'Matrix of size n × m (n rows, m columns).',
          'Step 1: Pick middle column j = m/2.',
          'Step 2: Find global 1D maximum of column j at row (i, j). Cost = O(n).',
          'Step 3: Compare A[i, j] to horizontal neighbors (i, j-1) and (i, j+1).',
          'Step 4: If A[i, j-1] > A[i, j], recurse on left columns 1...(j-1); else if A[i, j+1] > A[i, j], recurse on right; else (i, j) is a 2D peak!',
          'Recurrence: T(n, m) = T(n, m/2) + O(n) ⇒ T(n, m) = O(n log m).'
        ],
        formulasOrRules: ['T(n, m) = T(n, m/2) + O(n) = Θ(n log m)'],
        timestampRef: '34:20'
      }
    ],
    lectureSummary:
      'Peak Finding serves as the quintessential model for algorithmic optimization. While brute-force scans require linear time, divide-and-conquer leverages monotonic step guarantees to prune half the search space at each recurrence step, achieving Θ(log n) in 1D and Θ(n log m) in 2D.',
    flashcards: [
      {
        id: 'mit-fc-1',
        front: 'What is the worst-case time complexity of 1D Peak Finding using Divide-and-Conquer?',
        back: 'Θ(log n). At each step, comparing against neighbors takes O(1) time and halves the search space.',
        topic: 'Complexity',
        difficulty: 'Easy',
        masteryStatus: 'mastered'
      },
      {
        id: 'mit-fc-2',
        front: 'In 2D Peak Finding, why must we find the global maximum of the column instead of a local peak?',
        back: 'If we only pick a local 1D peak of the column, the horizontal neighbor might be larger, and recursing might cause the algorithm to loop or violate the boundary peak guarantee.',
        topic: '2D Algorithm',
        difficulty: 'Hard',
        masteryStatus: 'learning'
      },
      {
        id: 'mit-fc-3',
        front: 'What is the recurrence relation for the 2D Peak Finding algorithm?',
        back: 'T(n, m) = T(n, m/2) + O(n), where O(n) is the cost to find the maximum in the selected column.',
        topic: 'Recurrences',
        difficulty: 'Medium',
        masteryStatus: 'mastered'
      }
    ],
    quiz: [
      {
        id: 'mit-q-1',
        question: 'What is the time complexity of the 2D Peak Finding algorithm on an n x n matrix?',
        options: ['O(log n)', 'O(n log n)', 'O(n²)', 'O(n)'],
        answerIndex: 1,
        explanation:
          'Solving T(n, n) = T(n, n/2) + O(n) results in O(n) + O(n) + ... for log n levels, totaling O(n log n).',
        topic: 'Complexity Analysis'
      },
      {
        id: 'mit-q-2',
        question: 'Does every array of distinct integers always contain at least one peak element?',
        options: [
          'Yes, the global maximum is always a valid peak',
          'No, only sorted arrays contain peaks',
          'Only if the array length is odd',
          'Only if elements are non-negative'
        ],
        answerIndex: 0,
        explanation:
          'Because the array is finite, there must exist a maximum element. Since it is greater than or equal to all elements, it is greater than or equal to its neighbors, fulfilling the peak definition.',
        topic: 'Invariant Proof'
      }
    ],
    glossary: [
      {
        id: 'mit-g-1',
        term: 'Peak Element',
        definition: 'An entry in an array or grid that is greater than or equal to all adjacent orthogonal neighbors.',
        context: 'Introduced as the motivating algorithmic challenge in MIT 6.006 Lecture 1.'
      },
      {
        id: 'mit-g-2',
        term: 'Divide and Conquer',
        definition: 'An algorithmic paradigm that breaks a problem into independent subproblems, solves each recursively, and combines the results.',
        context: 'Applied to reduce linear search down to logarithmic recurrence.'
      }
    ],
    cheatSheet: {
      highYieldPoints: [
        '1D Peak Finding: O(log n) via binary splitting.',
        '2D Peak Finding: O(n log m) via column max + horizontal neighbor comparison.',
        'Recurrence: T(n) = T(n/2) + Θ(1) solves to Θ(log n).',
        'Global maximum is always a peak, but we only need to find ANY local peak.'
      ],
      commonPitfalls: [
        'Attempting 2D peak finding by alternating row and column 1D peaks (leads to infinite cycles!).',
        'Confusing Big-O (upper bound) with Big-Theta (tight bound).'
      ],
      examTips: [
        'Remember that for n=10⁶, log₂(n) ≈ 20 operations.'
      ]
    }
  }
];

