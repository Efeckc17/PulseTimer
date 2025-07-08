export const DEFAULT_SETTINGS = {
    work: {
        name: 'Work Time',
        hours: 0,
        minutes: 25
    },
    break: {
        name: 'Break Time',
        hours: 0,
        minutes: 5,
        intervalHours: 0,
        intervalMinutes: 25
    },
    notifications: {
        sound: true,
        desktop: true
    }
};

export const STORAGE_KEYS = {
    SETTINGS: 'pulseTimer_settings',
    HISTORY: 'pulseTimer_history',
    NOTIFICATION_PREFERENCE: 'pulseTimer_notifications'
};

export const NOTIFICATION_SOUNDS = {
    WORK_COMPLETE: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVqzn77BdGAg+ltryxnMpBSl+zPLaizsIGGS57OihUBELTKXh8bllHgU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEgODlOq5O+zYBoGPJPY88p2KwUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsLu45hFDBFYr+ftrVoXCECY3PLEcSYELIHO8diJOQgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVqzn77BdGAg+ltryxnMpBSl+zPLaizsIGGS57OihUBELTKXh8bllHgU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEgODlOq5O+zYBoGPJPY88p2KwUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsLu45hFDBFYr+ftrVoXCECY3PLEcSYELIHO8diJOQgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVqzn77BdGAg+ltryxnMpBSl+zPLaizsIGGS57OihUBELTKXh8bllHgU2jdXzzn0vBSF1xe/glEILElyx6OyrWBUIQ5zd8sFuJAUuhM/z1YU2Bhxqvu7mnEgODlOq5O+zYBoGPJPY88p2KwUme8rx3I4+CRZiturqpVITC0mi4PK8aB8GM4nU8tGAMQYfcsLu45hFDBFYr+ftrVoXCECY3PLEcSYEA='
}; 