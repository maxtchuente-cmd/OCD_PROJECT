export type Opportunity = { category: string; title: string; org: string; place: string; type: string; tag: string; color: string }
// Données de démonstration uniquement : elles ne représentent pas des annonces vérifiées.
export const opportunities: Opportunity[] = [
 { category: 'Emploi', title: 'Assistant·e de projet – développement', org: 'Impact Horizon', place: 'Douala, Cameroun', type: 'Temps plein', tag: 'À découvrir', color: 'orange' },
 { category: 'Bourse', title: 'Bourse internationale pour étudiants', org: 'Global Learning Fund', place: 'International · Hybride', type: 'Financement', tag: 'Candidatures ouvertes', color: 'blue' },
 { category: 'Formation', title: 'Compétences numériques et innovation', org: 'Open Skills Academy', place: 'En ligne', type: 'Formation', tag: 'En ligne', color: 'green' },
]
export const categories = [
 { icon: '▤', title: 'Emplois', desc: 'Faites évoluer votre carrière', color: 'orange' }, { icon: '✦', title: 'Bourses', desc: 'Financez vos études', color: 'violet' },
 { icon: '▣', title: 'Formations', desc: 'Développez vos compétences', color: 'blue' }, { icon: '↗', title: 'Financements', desc: 'Donnez vie à vos projets', color: 'green' },
 { icon: '⌘', title: 'Missions', desc: 'Trouvez votre prochaine mission', color: 'pink' }, { icon: '◎', title: 'Concours', desc: 'Saisissez de nouvelles chances', color: 'yellow' }, { icon: '✦', title: 'Services', desc: 'Proposez vos compétences et prestations', color: 'orange' },
]
