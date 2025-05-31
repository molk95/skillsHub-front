import { Component, OnInit } from '@angular/core';
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
    this.adminUsers = this.users.filter((user) => user.userRole === 'ADMIN');
    this.clientUsers = this.users.filter(
      (user) => user.userRole === 'CLIENT' || !user.userRole
    );
  }

  applySearch(): void {
    const term = this.searchTerm.toLowerCase();

    if (!term) {
      this.filteredAdminUsers = [...this.adminUsers];
      this.filteredClientUsers = [...this.clientUsers];
      return;
    }

    this.filteredAdminUsers = this.adminUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );

    this.filteredClientUsers = this.clientUsers.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }

  onSearchChange(): void {
    this.applySearch();
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

  getUserInitial(fullName: string): string {
    return fullName ? fullName.charAt(0).toUpperCase() : 'U';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
}
