export interface Action {
  id: string;
  user_id: string;
  user_name: string;
  activity_type: 'tree_planting' | 'fencing' | 'composting' | 'erosion_control';
  description: string;
  location: string;
  photo_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Token {
  id: string;
  user_id: string;
  action_id: string;
  value: number;
  created_at: string;
}

export const getActions = (): Action[] => {
  return JSON.parse(localStorage.getItem('actions') || '[]');
};

export const addAction = (action: Omit<Action, 'id' | 'created_at'>): Action => {
  const actions = getActions();
  const newAction: Action = {
    ...action,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };
  
  actions.push(newAction);
  localStorage.setItem('actions', JSON.stringify(actions));
  return newAction;
};

export const updateActionStatus = (actionId: string, status: 'approved' | 'rejected'): Action | null => {
  const actions = getActions();
  const actionIndex = actions.findIndex(a => a.id === actionId);
  
  if (actionIndex === -1) return null;
  
  actions[actionIndex].status = status;
  localStorage.setItem('actions', JSON.stringify(actions));
  
  return actions[actionIndex];
};

export const getTokens = (): Token[] => {
  return JSON.parse(localStorage.getItem('tokens') || '[]');
};

export const addToken = (token: Omit<Token, 'id' | 'created_at'>): Token => {
  const tokens = getTokens();
  const newToken: Token = {
    ...token,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString()
  };
  
  tokens.push(newToken);
  localStorage.setItem('tokens', JSON.stringify(tokens));
  return newToken;
};
