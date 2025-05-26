import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { debounce } from 'lodash';

// Action imports
import { fetchUserData, updateUserProfile, clearUserErrors } from './actions/userActions';
import { fetchOrganizationData, updateOrganizationSettings } from './actions/orgActions';
import { showNotification, hideNotification } from './actions/notificationActions';

// Component imports
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import UserProfileForm from './components/UserProfileForm';
import OrganizationSettings from './components/OrganizationSettings';
import ActivityLog from './components/ActivityLog';
import Analytics from './components/Analytics';

// Utility imports
import { validateEmail, validatePhone, sanitizeInput } from './utils/validation';
import { formatDate, formatCurrency, formatPercentage } from './utils/formatting';
import { API_ENDPOINTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';
import { trackEvent, trackPageView } from './utils/analytics';

// Style imports
import './styles/Dashboard.scss';
import './styles/Common.scss';

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      activeTab: 'profile',
      isLoading: true,
      isSaving: false,
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        role: '',
        timezone: '',
        notifications: true
      },
      errors: {},
      searchQuery: '',
      filterOptions: {
        dateRange: 'last30days',
        status: 'all',
        department: 'all'
      }
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleSearch = debounce(this.handleSearch.bind(this), 300);
  }
  
  componentDidMount() {
    this.loadInitialData();
    trackPageView('Dashboard');
    
    // Set up event listeners
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keydown', this.handleKeyPress);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleKeyPress);
    this.props.clearUserErrors();
  }
  
  async loadInitialData() {
    try {
      const { userId, organizationId } = this.props;
      
      await Promise.all([
        this.props.fetchUserData(userId),
        this.props.fetchOrganizationData(organizationId)
      ]);
      
      this.setState({ isLoading: false });
    } catch (error) {
      console.error('Failed to load initial data:', error);
      this.setState({ isLoading: false });
      this.props.showNotification({
        type: 'error',
        message: ERROR_MESSAGES.LOAD_FAILED
      });
    }
  }
  
  handleDataProcessing = (data) => {
    // Using arrow function for cleaner syntax
    const processedData = data.map(item => {
      const daysSinceCreation = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...item,
        formattedDate: formatDate(item.createdAt),
        formattedAmount: formatCurrency(item.amount),
        status: item.status.toLowerCase(),
        daysSinceCreation,
        isStale: daysSinceCreation > 30,
        priority: this.calculatePriority(item)
      };
    });
    
    // Apply all filters in one pass
    return processedData.filter(item => {
      // Status filter
      if (this.state.filterOptions.status !== 'all' && item.status !== this.state.filterOptions.status) {
        return false;
      }
      
      // Department filter
      if (this.state.filterOptions.department !== 'all' && item.department !== this.state.filterOptions.department) {
        return false;
      }
      
      // Date range filter
      if (!this.isWithinDateRange(item.createdAt, this.state.filterOptions.dateRange)) {
        return false;
      }
      
      // Search filter
      if (this.state.searchQuery) {
        const searchFields = [item.name, item.email, item.department, item.role].join(' ').toLowerCase();
        return searchFields.includes(this.state.searchQuery.toLowerCase());
      }
      
      return true;
    });
  }
  
  calculatePriority = (item) => {
    let priority = 0;
    
    if (item.amount > 10000) priority += 3;
    if (item.status === 'urgent') priority += 5;
    if (item.dueDate && new Date(item.dueDate) < new Date()) priority += 2;
    
    return Math.min(priority, 10);
  }
  
  isWithinDateRange = (date, range) => {
    const itemDate = new Date(date);
    const now = new Date();
    
    switch(range) {
      case 'today':
        return itemDate.toDateString() === now.toDateString();
      case 'last7days':
        return itemDate >= new Date(now.setDate(now.getDate() - 7));
      case 'last30days':
        return itemDate >= new Date(now.setDate(now.getDate() - 30));
      case 'last90days':
        return itemDate >= new Date(now.setDate(now.getDate() - 90));
      default:
        return true;
    }
  }
  
  calculateMetrics(data) {
    const metrics = {
      totalUsers: data.length,
      activeUsers: data.filter(user => user.isActive).length,
      inactiveUsers: data.filter(user => !user.isActive).length,
      averageEngagement: 0,
      growthRate: 0
    };
    
    const totalEngagement = data.reduce((sum, user) => sum + user.engagementScore, 0);
    metrics.averageEngagement = totalEngagement / data.length;
    
    return metrics;
  }
  
  validateForm() {
    const errors = {};
    const { formData } = this.state;
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    return errors;
  }
  
  async handleSubmit(event) {
    event.preventDefault();
    
    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }
    
    this.setState({ isSaving: true, errors: {} });
    
    try {
      const sanitizedData = {
        ...this.state.formData,
        firstName: sanitizeInput(this.state.formData.firstName),
        lastName: sanitizeInput(this.state.formData.lastName)
      };
      
      await this.props.updateUserProfile(this.props.userId, sanitizedData);
      
      this.props.showNotification({
        type: 'success',
        message: SUCCESS_MESSAGES.PROFILE_UPDATED
      });
      
      trackEvent('Profile Updated', sanitizedData);
    } catch (error) {
      console.error('Failed to update profile:', error);
      this.props.showNotification({
        type: 'error',
        message: ERROR_MESSAGES.UPDATE_FAILED
      });
    } finally {
      this.setState({ isSaving: false });
    }
  }
  
  render() {
    const { user, organization, notifications } = this.props;
    const { activeTab, isLoading, isSaving } = this.state;
    
    if (isLoading) {
      return <LoadingSpinner fullScreen />;
    }
    
    return (
      <ErrorBoundary>
        <div className="dashboard-container">
          <Header
            user={user}
            organization={organization}
            onLogout={this.handleLogout}
          />
          
          <div className="dashboard-content">
            <Sidebar
              activeTab={activeTab}
              onTabChange={this.handleTabChange}
              userRole={user.role}
            />
            
            <main className="dashboard-main">
              <div className="dashboard-header">
                <h1>{this.getPageTitle()}</h1>
                <div className="dashboard-actions">
                  <button
                    className="btn btn-primary"
                    onClick={this.handleRefresh}
                    disabled={isLoading}
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
              
              <div className="dashboard-body">
                {this.renderActiveContent()}
              </div>
            </main>
          </div>
          
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              {...notification}
              onClose={() => this.props.hideNotification(notification.id)}
            />
          ))}
        </div>
      </ErrorBoundary>
    );
  }
}

DashboardContainer.propTypes = {
  user: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  notifications: PropTypes.array.isRequired,
  fetchUserData: PropTypes.func.isRequired,
  updateUserProfile: PropTypes.func.isRequired,
  clearUserErrors: PropTypes.func.isRequired,
  fetchOrganizationData: PropTypes.func.isRequired,
  updateOrganizationSettings: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  hideNotification: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user.data,
  organization: state.organization.data,
  userId: state.auth.userId,
  organizationId: state.auth.organizationId,
  notifications: state.notifications.items
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUserData,
  updateUserProfile,
  clearUserErrors,
  fetchOrganizationData,
  updateOrganizationSettings,
  showNotification,
  hideNotification
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
