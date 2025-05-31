import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const backendServer = 'http://localhost:3000';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  userRole: string;
  skills: string[];
  communities: string[];
  challenges: string[];
  badges: string[];
  feedback: string[];
  wallet?: string;
  github?: {
    username: string;
    validatedSkills: any[];
    lastUpdated: string;
  };
  resetToken?: string;
  resetTokenExpiresAt?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Role {
  _id: string;
  title: string;
  users: string[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  users: User[] = [];
  roles: Role[] = [];
  adminUsers: User[] = [];
  clientUsers: User[] = [];
  loading = false;
  loadingRoles = false;
  error: string | null = null;

  // Modal states
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedUser: User | null = null;

  // Forms
  addUserForm: FormGroup;
  editUserForm: FormGroup;

  // Search and filter
  searchTerm = '';
  filteredAdminUsers: User[] = [];
  filteredClientUsers: User[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder) {
    console.log('Constructor called'); // Debug log
    this.addUserForm = this.createUserForm();
    this.editUserForm = this.createUserForm();
    console.log('Forms initialized:', this.addUserForm, this.editUserForm); // Debug log
  }

  ngOnInit(): void {
    console.log('ngOnInit called'); // Debug log
    this.loadUsers();
    this.loadRoles();
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      userRole: ['CLIENT', Validators.required],
      role: ['', Validators.required], // Make it required since we'll select from dropdown
      skills: [[]],
      communities: [[]],
      challenges: [[]],
      badges: [[]],
      feedback: [[]],
      wallet: [''],
      github: this.fb.group({
        username: [''],
        validatedSkills: [[]],
        lastUpdated: [''],
      }),
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.http.get<User[]>(`${backendServer}/api/users`).subscribe({
      next: (users) => {
        this.users = users;
        this.groupUsersByRole();
        this.applySearch();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      },
    });
  }

  loadRoles(): void {
    this.loadingRoles = true;

    this.http.get<Role[]>(`${backendServer}/api/roles`).subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loadingRoles = false;
        console.log('Roles loaded:', roles);
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        this.loadingRoles = false;
        // Set default roles if API fails
        this.roles = [
          {
            _id: '67dea76e2f7de52f2ddfb22c',
            title: 'ADMIN',
            users: [],
            deletedAt: null,
            createdAt: '',
            updatedAt: '',
          },
          {
            _id: '67dea9f480ccdc88548f99e7',
            title: 'CLIENT',
            users: [],
            deletedAt: null,
            createdAt: '',
            updatedAt: '',
          },
        ];
      },
    });
  }

  groupUsersByRole(): void {
    // Handle users with and without userRole field
    this.adminUsers = this.users.filter(
      (user) =>
        user.userRole === 'ADMIN' ||
        (!user.userRole && user.role === '67dea76e2f7de52f2ddfb22c')
    );
    this.clientUsers = this.users.filter(
      (user) =>
        user.userRole === 'CLIENT' ||
        !user.userRole ||
        user.role === '67dea9f480ccdc88548f99e7'
    );

    console.log('Grouped users:', {
      admins: this.adminUsers.length,
      clients: this.clientUsers.length,
      total: this.users.length,
    });
  }

  applySearch(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredAdminUsers = [...this.adminUsers];
      this.filteredClientUsers = [...this.clientUsers];
      return;
    }

    console.log('Searching for:', term);

    // Enhanced search function that searches multiple fields
    const searchUser = (user: User): boolean => {
      // Search in basic user information
      const basicSearch = [
        user.fullName?.toLowerCase() || '',
        user.email?.toLowerCase() || '',
        user.userRole?.toLowerCase() || '',
        user.role?.toLowerCase() || '',
      ].some((field) => field.includes(term));

      // Search in skills array (if populated) - these are IDs so partial matches work
      const skillsSearch =
        user.skills?.some((skill) => skill?.toLowerCase().includes(term)) ||
        false;

      // Search in communities array (if populated) - these are IDs
      const communitiesSearch =
        user.communities?.some((community) =>
          community?.toLowerCase().includes(term)
        ) || false;

      // Search in GitHub username (if exists)
      const githubSearch =
        user.github?.username?.toLowerCase().includes(term) || false;

      // Search in creation date (format: YYYY-MM-DD)
      const dateSearch = user.createdAt?.toLowerCase().includes(term) || false;

      // Search in wallet ID
      const walletSearch = user.wallet?.toLowerCase().includes(term) || false;

      return (
        basicSearch ||
        skillsSearch ||
        communitiesSearch ||
        githubSearch ||
        dateSearch ||
        walletSearch
      );
    };

    this.filteredAdminUsers = this.adminUsers.filter(searchUser);
    this.filteredClientUsers = this.clientUsers.filter(searchUser);

    console.log('Search results:', {
      term,
      admins: this.filteredAdminUsers.length,
      clients: this.filteredClientUsers.length,
      total: this.filteredAdminUsers.length + this.filteredClientUsers.length,
    });
  }

  onSearchChange(): void {
    this.applySearch();
  }

  // Handle search input click for debugging
  onSearchInputClick(): void {
    console.log('Search input clicked - interaction working!');
    // Focus the input to ensure it's interactive
    if (this.searchInputRef) {
      this.searchInputRef.nativeElement.focus();
    }
  }

  // Method to highlight search terms in text
  highlightSearchTerm(text: string): string {
    if (!this.searchTerm || !text) return text;

    const term = this.searchTerm.trim();
    if (!term) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(
      regex,
      '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
    );
  }

  // Get search statistics
  getSearchStats(): { total: number; admins: number; clients: number } {
    return {
      total: this.filteredAdminUsers.length + this.filteredClientUsers.length,
      admins: this.filteredAdminUsers.length,
      clients: this.filteredClientUsers.length,
    };
  }

  // Clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.applySearch();
  }

  // Keyboard shortcut handling
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    // Ctrl+F or Cmd+F to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      this.focusSearchInput();
    }
  }

  // Focus the search input
  focusSearchInput(): void {
    if (this.searchInputRef) {
      this.searchInputRef.nativeElement.focus();
      this.searchInputRef.nativeElement.select();
    }
  }

  // Modal operations
  openAddModal(): void {
    console.log('Opening add user modal');
    this.addUserForm.reset();

    // Set default role to CLIENT if available
    const clientRole = this.roles.find((role) => role.title === 'CLIENT');
    const defaultRoleId = clientRole
      ? clientRole._id
      : '67dea9f480ccdc88548f99e7';

    this.addUserForm.patchValue({
      userRole: 'CLIENT',
      role: defaultRoleId,
    });
    this.showAddModal = true;
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.editUserForm.patchValue({
      fullName: user.fullName,
      email: user.email,
      password: '', // Don't show existing password
      userRole: user.userRole || 'CLIENT',
      role: user.role,
      skills: user.skills || [],
      communities: user.communities || [],
      challenges: user.challenges || [],
      badges: user.badges || [],
      feedback: user.feedback || [],
      wallet: user.wallet || '',
      github: {
        username: user.github?.username || '',
        validatedSkills: user.github?.validatedSkills || [],
        lastUpdated: user.github?.lastUpdated || '',
      },
    });
    this.showEditModal = true;
  }

  openDeleteModal(user: User): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  // CRUD operations
  addUser(): void {
    if (this.addUserForm.valid) {
      const formData = this.addUserForm.value;

      // Prepare the payload exactly as specified
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role || '67dea76e2f7de52f2ddfb22c', // Use form value or default
      };

      console.log('Sending payload:', payload);

      this.http.post<User>(`${backendServer}/api/users`, payload).subscribe({
        next: (newUser) => {
          console.log('User created successfully:', newUser);
          this.users.push(newUser);
          this.groupUsersByRole();
          this.applySearch();
          this.closeModals();
        },
        error: (err) => {
          console.error('Error adding user:', err);
          this.error = 'Failed to add user. Please try again.';
        },
      });
    } else {
      console.log('Form is invalid:', this.addUserForm.errors);
      // Mark all fields as touched to show validation errors
      Object.keys(this.addUserForm.controls).forEach((key) => {
        this.addUserForm.get(key)?.markAsTouched();
      });
    }
  }

  updateUser(): void {
    if (this.editUserForm.valid && this.selectedUser) {
      const formData = this.editUserForm.value;

      // Create update payload with only changed fields
      const payload: any = {
        fullName: formData.fullName,
        email: formData.email,
        userRole: formData.userRole,
        role: formData.role,
        skills: formData.skills,
        communities: formData.communities,
        challenges: formData.challenges,
        badges: formData.badges,
        feedback: formData.feedback,
        wallet: formData.wallet,
        github: formData.github,
      };

      // Only include password if it's been changed
      if (formData.password) {
        payload.password = formData.password;
      }

      this.http
        .put<User>(
          `${backendServer}/api/users/${this.selectedUser._id}`,
          payload
        )
        .subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(
              (u) => u._id === this.selectedUser!._id
            );
            if (index !== -1) {
              this.users[index] = updatedUser;
              this.groupUsersByRole();
              this.applySearch();
            }
            this.closeModals();
          },
          error: (err) => {
            console.error('Error updating user:', err);
            this.error = 'Failed to update user. Please try again.';
          },
        });
    }
  }

  deleteUser(): void {
    if (this.selectedUser) {
      const deleteUrl = `${backendServer}/api/users/${this.selectedUser._id}`;
      console.log('Deleting user with URL:', deleteUrl);
      console.log('Selected user:', this.selectedUser);

      this.http.delete(deleteUrl).subscribe({
        next: () => {
          console.log(
            'User deleted successfully:',
            this.selectedUser?.fullName
          );
          this.users = this.users.filter(
            (u) => u._id !== this.selectedUser!._id
          );
          this.groupUsersByRole();
          this.applySearch();
          this.closeModals();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          console.error('Failed URL:', deleteUrl);
          this.error = 'Failed to delete user. Please try again.';
        },
      });
    }
  }

  testClick(): void {
    alert('Test button clicked!');
  }

  // Test search functionality
  testSearchFunctionality(): void {
    console.log('=== SEARCH FUNCTIONALITY TEST ===');
    console.log('Total users loaded:', this.users.length);
    console.log('Admin users:', this.adminUsers.length);
    console.log('Client users:', this.clientUsers.length);
    console.log('Current search term:', this.searchTerm);
    console.log('Search input element:', this.searchInputRef?.nativeElement);

    // Try to focus the search input
    if (this.searchInputRef) {
      this.searchInputRef.nativeElement.focus();
      this.searchInputRef.nativeElement.style.backgroundColor = 'lightblue';
      console.log('Search input focused and highlighted');
    } else {
      console.error('Search input reference not found!');
    }

    // Test search with a sample term
    this.searchTerm = 'admin';
    this.onSearchChange();

    setTimeout(() => {
      this.searchTerm = '';
      this.onSearchChange();
      if (this.searchInputRef) {
        this.searchInputRef.nativeElement.style.backgroundColor = 'white';
      }
    }, 2000);
  }

  getUserInitial(fullName: string): string {
    return fullName ? fullName.charAt(0).toUpperCase() : 'U';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
}
