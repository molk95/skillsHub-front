import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommunityService } from './community.service';
import { Community, CommunityCreateDto, CommunityUpdateDto } from '../models/communities.model';
import { environment } from '../../../../environments/environment';

describe('CommunityService', () => {
  let service: CommunityService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/communities`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunityService]
    });
    service = TestBed.inject(CommunityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all communities', () => {
    const mockCommunities: Community[] = [
      {
        _id: '1',
        name: 'Community 1',
        creator: { _id: 'user1', fullName: 'User One', email: 'user1@example.com' },
        members: [],
        forums: [],
        events: [],
        isActive: true,
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
      },
      {
        _id: '2',
        name: 'Community 2',
        creator: { _id: 'user2', fullName: 'User Two', email: 'user2@example.com' },
        members: [],
        forums: [],
        events: [],
        isActive: true,
        createdAt: '2023-01-02',
        updatedAt: '2023-01-02'
      }
    ];

    service.getAllCommunities().subscribe(response => {
      expect(response.data).toEqual(mockCommunities);
      expect(response.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockCommunities });
  });

  it('should get a community by ID', () => {
    const mockCommunity: Community = {
      _id: '1',
      name: 'Test Community',
      creator: { _id: 'user1', fullName: 'User One', email: 'user1@example.com' },
      members: [],
      forums: [],
      events: [],
      isActive: true,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01'
    };

    service.getCommunityById('1').subscribe(response => {
      expect(response.data).toEqual(mockCommunity);
      expect(response.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockCommunity });
  });

  it('should create a new community', () => {
    const newCommunity: CommunityCreateDto = {
      name: 'New Community',
      description: 'A new test community'
    };

    const mockResponse: Community = {
      _id: '3',
      name: 'New Community',
      description: 'A new test community',
      creator: { _id: 'user1', fullName: 'User One', email: 'user1@example.com' },
      members: [],
      forums: [],
      events: [],
      isActive: true,
      createdAt: '2023-01-03',
      updatedAt: '2023-01-03'
    };

    service.createCommunity(newCommunity).subscribe(response => {
      expect(response.data).toEqual(mockResponse);
      expect(response.success).toBeTrue();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('