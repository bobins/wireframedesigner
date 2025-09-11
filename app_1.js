// Application Data - Updated structure based on requirements
const appData = {
  sectionTemplates: [
    {
      "id": "home", 
      "name": "Home", 
      "icon": "🏠", 
      "type": "section", 
      "allowsContent": true,
      "preloadedContent": [
        {"name": "Unit Outline", "type": "resource", "icon": "📋"},
        {"name": "Announcements", "type": "resource", "icon": "📢"}
      ]
    },
    {
      "id": "assessments", 
      "name": "Assessments", 
      "icon": "📝", 
      "type": "section", 
      "allowsContent": true,
      "preloadedContent": [
        {"name": "Assignment", "type": "activity", "icon": "📝"},
        {"name": "Peer Assessment", "type": "activity", "icon": "👨‍🏫"}
      ]
    },
    {
      "id": "topic", 
      "name": "Topic", 
      "icon": "📖", 
      "type": "section", 
      "allowsContent": true,
      "preloadedContent": []
    },
    {
      "id": "module", 
      "name": "Module", 
      "icon": "📚", 
      "type": "section", 
      "allowsContent": true,
      "preloadedContent": [
        {"name": "Topic 1", "type": "subsection", "icon": "📋"},
        {"name": "Topic 2", "type": "subsection", "icon": "📋"},
        {"name": "Topic 3", "type": "subsection", "icon": "📋"}
      ]
    },
    {
      "id": "what-is-on-this-week", 
      "name": "What is on this week", 
      "icon": "📅", 
      "type": "section", 
      "allowsContent": false,
      "preloadedContent": []
    }
  ],
  resources: [
    {"id": "unit-outline", "name": "Unit Outline", "icon": "📋", "type": "resource"},
    {"id": "read", "name": "Read", "icon": "📄", "type": "resource"},
    {"id": "watch", "name": "Watch", "icon": "🎥", "type": "resource"},
    {"id": "listen", "name": "Listen", "icon": "🎧", "type": "resource"},
    {"id": "external-link", "name": "External Link", "icon": "🔗", "type": "resource"},
    {"id": "folder", "name": "Folder", "icon": "📁", "type": "resource"}
  ],
  activities: [
    {"id": "forum", "name": "Forum", "icon": "💬", "type": "activity"},
    {"id": "quiz", "name": "Quiz", "icon": "❓", "type": "activity"},
    {"id": "assignment", "name": "Assignment", "icon": "📝", "type": "activity"},
    {"id": "poll", "name": "Poll", "icon": "📊", "type": "activity"},
    {"id": "group-selection", "name": "Group Selection", "icon": "👥", "type": "activity"},
    {"id": "checklist", "name": "Checklist", "icon": "✅", "type": "activity"},
    {"id": "database", "name": "Database", "icon": "🗃️", "type": "activity"},
    {"id": "glossary", "name": "Glossary", "icon": "📚", "type": "activity"},
    {"id": "peer-assessment", "name": "Peer Assessment", "icon": "👨‍🏫", "type": "activity"},
    {"id": "board", "name": "Board", "icon": "📌", "type": "activity"}
  ],
  designElements: [
    {"id": "pre-class", "name": "Pre-Class", "icon": "📝", "type": "design-element"},
    {"id": "in-class", "name": "In-Class", "icon": "🏫", "type": "design-element"},
    {"id": "post-class", "name": "Post-Class", "icon": "📚", "type": "design-element"},
    {"id": "practical", "name": "Practical", "icon": "🔧", "type": "design-element"}
  ],
  hierarchyRules: {
    "section": ["subsection", "resource", "activity", "design-element"],
    "section-special": [],
    "subsection": ["resource", "activity", "design-element"],
    "resource": [],
    "activity": [],
    "design-element": []
  },
  propertyFields: {
    "section": ["name", "summaryForStudents", "notesForDeveloper"],
    "subsection": ["name", "summaryForStudents", "notesForDeveloper"],
    "resource": ["name", "description", "approxLearningTime"],
    "activity": ["name", "description", "approxLearningTime"],
    "design-element": ["name"]
  },
  sidebarCategories: [
    {"id": "custom-elements", "name": "Custom Elements", "expanded": true},
    {"id": "section-templates", "name": "Section Templates", "expanded": true},
    {"id": "resources", "name": "Resources", "expanded": true},
    {"id": "activities", "name": "Activities", "expanded": true},
    {"id": "design-elements", "name": "Design Elements", "expanded": true}
  ]
};

// Application State
let canvasData = {
  sections: [],
  customCounter: 0
};

let draggedElement = null;
let selectedElement = null;
let contextMenuTarget = null;
let dropZoneIndicator = null;
let dragOverElement = null;
let currentMoveElement = null;
let currentDeleteElement = null;
let lastDropTarget = null;
let dropPosition = null; // 'above', 'below', or 'inside'

// DOM Elements
const canvasEl = document.getElementById('canvas');
const canvasPlaceholder = document.getElementById('canvas-placeholder');
const dragPreview = document.getElementById('drag-preview');
const contextMenu = document.getElementById('context-menu');
const moveModal = document.getElementById('move-modal');
const deleteModal = document.getElementById('delete-modal');
const starterGuideModal = document.getElementById('starter-guide-modal');
const propertiesPanel = document.getElementById('properties-panel');
const propertiesContent = document.getElementById('properties-content');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeComponentLibrary();
  initializeSidebarToggle();
  initializeEventListeners();
  loadCanvasData();
  dropZoneIndicator = document.getElementById('drop-zone-indicator');
  
  // Auto-open Starter Guide on first load
  showStarterGuide();
});

// Starter Guide Functions
function showStarterGuide() {
  starterGuideModal.classList.remove('hidden');
}

function hideStarterGuide() {
  starterGuideModal.classList.add('hidden');
}

// Initialize Sidebar Toggle Functionality
function initializeSidebarToggle() {
  const sidebarHeaders = document.querySelectorAll('.sidebar-header');
  
  sidebarHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const categoryId = this.dataset.category;
      const toggle = this.querySelector('.sidebar-toggle');
      const content = this.nextElementSibling;
      
      // Toggle collapsed state
      const isCollapsed = content.classList.contains('collapsed');
      
      if (isCollapsed) {
        content.classList.remove('collapsed');
        toggle.classList.remove('collapsed');
        toggle.textContent = '▼';
      } else {
        content.classList.add('collapsed');
        toggle.classList.add('collapsed');
        toggle.textContent = '▶';
      }
      
      // Save state
      const category = appData.sidebarCategories.find(cat => cat.id === categoryId);
      if (category) {
        category.expanded = isCollapsed;
        saveSidebarState();
      }
    });
  });
  
  // Load saved sidebar state
  loadSidebarState();
}

function saveSidebarState() {
  localStorage.setItem('lms_wireframe_sidebar', JSON.stringify(appData.sidebarCategories));
}

function loadSidebarState() {
  const saved = localStorage.getItem('lms_wireframe_sidebar');
  if (saved) {
    try {
      const savedCategories = JSON.parse(saved);
      savedCategories.forEach(savedCat => {
        const category = appData.sidebarCategories.find(cat => cat.id === savedCat.id);
        if (category) {
          category.expanded = savedCat.expanded;
        }
      });
    } catch (e) {
      console.error('Error loading sidebar state:', e);
    }
  }
  
  // Apply saved states
  appData.sidebarCategories.forEach(category => {
    const header = document.querySelector(`[data-category="${category.id}"]`);
    if (header) {
      const toggle = header.querySelector('.sidebar-toggle');
      const content = header.nextElementSibling;
      
      if (!category.expanded) {
        content.classList.add('collapsed');
        toggle.classList.add('collapsed');
        toggle.textContent = '▶';
      }
    }
  });
}

// Initialize Component Library
function initializeComponentLibrary() {
  // Populate section templates
  const sectionTemplatesListEl = document.getElementById('section-templates-list');
  appData.sectionTemplates.forEach(section => {
    const sectionEl = createComponentItem(section);
    sectionTemplatesListEl.appendChild(sectionEl);
  });

  // Populate resources
  const resourcesListEl = document.getElementById('resources-list');
  appData.resources.forEach(resource => {
    const resourceEl = createComponentItem(resource);
    resourcesListEl.appendChild(resourceEl);
  });

  // Populate activities
  const activitiesListEl = document.getElementById('activities-list');
  appData.activities.forEach(activity => {
    const activityEl = createComponentItem(activity);
    activitiesListEl.appendChild(activityEl);
  });

  // Populate design elements
  const designElementsListEl = document.getElementById('design-elements-list');
  appData.designElements.forEach(element => {
    const elementEl = createComponentItem(element);
    designElementsListEl.appendChild(elementEl);
  });
}

// Create Component Item Element
function createComponentItem(item) {
  const div = document.createElement('div');
  div.className = 'component-item';
  div.draggable = true;
  div.dataset.type = item.type;
  div.dataset.id = item.id;
  div.dataset.name = item.name;
  div.dataset.icon = item.icon;
  div.dataset.allowsContent = item.allowsContent !== undefined ? item.allowsContent : true;

  div.innerHTML = `
    <span class="component-icon">${item.icon}</span>
    <span class="component-name">${item.name}</span>
  `;

  return div;
}

// Initialize Event Listeners
function initializeEventListeners() {
  // Drag and Drop Events
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('drop', handleDrop);
  document.addEventListener('dragend', handleDragEnd);

  // Toolbar Events
  document.getElementById('help-btn').addEventListener('click', showStarterGuide);
  document.getElementById('save-btn').addEventListener('click', saveCanvas);
  document.getElementById('clear-btn').addEventListener('click', clearCanvas);
  document.getElementById('export-btn').addEventListener('click', exportCanvasToPDF);

  // Custom Element Creation
  document.getElementById('add-section-btn').addEventListener('click', addCustomSection);
  document.getElementById('add-subsection-btn').addEventListener('click', addCustomSubsection);
  document.getElementById('add-resource-btn').addEventListener('click', addCustomResource);
  document.getElementById('add-activity-btn').addEventListener('click', addCustomActivity);

  // Context Menu Events
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('click', hideContextMenu);
  document.getElementById('move-item').addEventListener('click', openMoveMenuFromContext);
  document.getElementById('delete-item').addEventListener('click', openDeleteConfirmationFromContext);

  // Starter Guide Events
  document.getElementById('starter-guide-close').addEventListener('click', hideStarterGuide);
  document.getElementById('starter-guide-ok').addEventListener('click', hideStarterGuide);

  // Move Modal Events
  document.getElementById('move-modal-close').addEventListener('click', closeMoveModal);
  document.getElementById('cancel-move').addEventListener('click', closeMoveModal);

  // Delete Modal Events
  document.getElementById('delete-modal-close').addEventListener('click', closeDeleteModal);
  document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
  document.getElementById('confirm-delete').addEventListener('click', confirmDelete);

  // Click outside modal to close
  starterGuideModal.addEventListener('click', function(e) {
    if (e.target === starterGuideModal) {
      hideStarterGuide();
    }
  });

  moveModal.addEventListener('click', function(e) {
    if (e.target === moveModal) {
      closeMoveModal();
    }
  });

  deleteModal.addEventListener('click', function(e) {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });

  // Canvas click events for selection
  document.addEventListener('click', function(e) {
    const target = e.target.closest('.canvas-section, .canvas-subsection, .content-item');
    if (target) {
      selectElement(target);
    } else if (!e.target.closest('.properties-panel, .context-menu, .modal')) {
      clearSelection();
    }
  });

  // Event delegation for dynamically created move buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('control-btn') && e.target.textContent.includes('↕️')) {
      e.preventDefault();
      e.stopPropagation();
      const element = e.target.closest('.canvas-section, .canvas-subsection, .content-item');
      if (element) {
        showMoveMenu(element);
      }
    }
  });

  // Event delegation for dynamically created delete buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('control-btn') && e.target.textContent.includes('🗑️')) {
      e.preventDefault();
      e.stopPropagation();
      const element = e.target.closest('.canvas-section, .canvas-subsection, .content-item');
      if (element) {
        showDeleteConfirmation(element);
      }
    }
  });
}

// Enhanced Drag and Drop Handlers - Fixed for bidirectional movement
function handleDragStart(e) {
  if (!e.target.classList.contains('component-item') && 
      !e.target.classList.contains('canvas-section') && 
      !e.target.classList.contains('canvas-subsection') &&
      !e.target.classList.contains('content-item')) {
    return;
  }

  draggedElement = e.target;
  e.target.classList.add('dragging');

  // Create drag preview
  const name = e.target.dataset.name || 
                e.target.querySelector('.section-name, .subsection-name, .content-name')?.textContent || 
                'Unknown Item';
  
  dragPreview.textContent = name;
  dragPreview.classList.remove('hidden');
  dragPreview.style.left = e.clientX + 10 + 'px';
  dragPreview.style.top = e.clientY + 10 + 'px';

  // Set drag data
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');
}

function handleDragOver(e) {
  e.preventDefault();

  // Update drag preview position
  if (!dragPreview.classList.contains('hidden')) {
    dragPreview.style.left = e.clientX + 10 + 'px';
    dragPreview.style.top = e.clientY + 10 + 'px';
  }

  if (!draggedElement) return;

  const draggedType = getDraggedElementType();
  const dropInfo = findValidDropTarget(e.target, draggedType, e.clientY);
  
  // Clear all drag-over states and indicators
  clearAllDropIndicators();
  
  if (dropInfo && isValidDrop(draggedType, dropInfo.target, dropInfo.position)) {
    // Show appropriate visual feedback based on drop position
    showDropFeedback(dropInfo.target, dropInfo.position);
    e.dataTransfer.dropEffect = 'move';
    showDropZoneIndicator(e.clientX, e.clientY, true);
    lastDropTarget = dropInfo.target;
    dropPosition = dropInfo.position;
  } else {
    e.dataTransfer.dropEffect = 'none';
    showDropZoneIndicator(e.clientX, e.clientY, false);
    lastDropTarget = null;
    dropPosition = null;
  }
}

function handleDrop(e) {
  e.preventDefault();
  
  if (!draggedElement || !lastDropTarget) {
    hideDropZoneIndicator();
    clearAllDropIndicators();
    return;
  }

  const draggedType = getDraggedElementType();
  
  // Hide placeholder if it exists
  if (canvasPlaceholder) {
    canvasPlaceholder.style.display = 'none';
  }

  // Handle different drop scenarios with enhanced positioning
  if (draggedElement.classList.contains('component-item')) {
    handleComponentDrop(draggedElement, lastDropTarget, dropPosition);
  } else {
    handleExistingElementMove(draggedElement, lastDropTarget, dropPosition);
  }

  hideDropZoneIndicator();
  clearAllDropIndicators();
  lastDropTarget = null;
  dropPosition = null;
}

function handleDragEnd(e) {
  if (e.target.classList.contains('dragging')) {
    e.target.classList.remove('dragging');
  }
  
  draggedElement = null;
  lastDropTarget = null;
  dropPosition = null;
  dragPreview.classList.add('hidden');
  hideDropZoneIndicator();
  clearAllDropIndicators();
}

// Enhanced Helper Functions for Bidirectional Drag and Drop
function getDraggedElementType() {
  if (!draggedElement) return null;
  
  if (draggedElement.classList.contains('component-item')) {
    return draggedElement.dataset.type;
  } else if (draggedElement.classList.contains('canvas-section')) {
    return 'section';
  } else if (draggedElement.classList.contains('canvas-subsection')) {
    return 'subsection';
  } else if (draggedElement.classList.contains('content-item')) {
    return draggedElement.dataset.type;
  }
  
  return null;
}

function findValidDropTarget(target, draggedType, clientY) {
  if (!draggedType) return null;

  // Find the most specific valid container
  let dropTarget = null;
  let position = 'inside';

  // For sections, drop on canvas or between other sections
  if (draggedType === 'section') {
    const canvasElement = target.closest('.canvas');
    if (canvasElement) {
      const sections = Array.from(canvasElement.querySelectorAll('.canvas-section'));
      const targetSection = target.closest('.canvas-section');
      
      if (targetSection && targetSection !== draggedElement) {
        const rect = targetSection.getBoundingClientRect();
        const sectionMiddle = rect.top + rect.height / 2;
        
        position = clientY < sectionMiddle ? 'above' : 'below';
        dropTarget = targetSection;
      } else if (sections.length === 0 || !targetSection) {
        dropTarget = canvasElement;
        position = 'inside';
      }
    }
  } else {
    // For content items, find section or subsection content areas
    const sectionContent = target.closest('.section-content');
    const subsectionContent = target.closest('.subsection-content');
    
    if (subsectionContent) {
      dropTarget = subsectionContent;
      
      // Check if dropping between items
      const targetItem = target.closest('.content-item, .canvas-subsection');
      if (targetItem && targetItem !== draggedElement) {
        const rect = targetItem.getBoundingClientRect();
        const itemMiddle = rect.top + rect.height / 2;
        position = clientY < itemMiddle ? 'above' : 'below';
        dropTarget = targetItem.parentElement; // Use parent container
      } else {
        position = 'inside';
      }
    } else if (sectionContent) {
      dropTarget = sectionContent;
      
      // Check if dropping between items
      const targetItem = target.closest('.content-item, .canvas-subsection');
      if (targetItem && targetItem !== draggedElement) {
        const rect = targetItem.getBoundingClientRect();
        const itemMiddle = rect.top + rect.height / 2;
        position = clientY < itemMiddle ? 'above' : 'below';
        dropTarget = targetItem.parentElement; // Use parent container
      } else {
        position = 'inside';
      }
    }
  }
  
  return dropTarget ? { target: dropTarget, position, referenceElement: target.closest('.content-item, .canvas-subsection') } : null;
}

function isValidDrop(draggedType, dropTarget, position) {
  // Don't allow dropping on self
  if (dropTarget === draggedElement) return false;
  
  // Check if the section allows content (for "What is on this week" sections)
  if (dropTarget.classList.contains('section-content')) {
    const section = dropTarget.closest('.canvas-section');
    if (section && section.classList.contains('special-section')) {
      return false;
    }
  }
  
  // Validate hierarchy rules
  const allowedContainers = getValidContainers(draggedType);
  
  if (draggedType === 'section') {
    return dropTarget.classList.contains('canvas') || dropTarget.classList.contains('canvas-section');
  } else {
    return allowedContainers.some(containerType => {
      if (containerType === 'section-content') {
        return dropTarget.classList.contains('section-content');
      }
      if (containerType === 'subsection-content') {
        return dropTarget.classList.contains('subsection-content');
      }
      return false;
    });
  }
}

function getValidContainers(itemType) {
  switch (itemType) {
    case 'section':
      return ['canvas'];
    case 'subsection':
    case 'resource':
    case 'activity':
    case 'design-element':
      return ['section-content', 'subsection-content'];
    default:
      return [];
  }
}

function showDropFeedback(dropTarget, position) {
  if (position === 'above' || position === 'below') {
    const targetElement = dropTarget.classList.contains('canvas-section') ? 
      dropTarget : dropTarget.querySelector('.content-item, .canvas-subsection');
    
    if (targetElement) {
      targetElement.classList.add('drop-insertion-indicator');
      targetElement.classList.add(`drop-${position}`);
    }
  } else {
    dropTarget.classList.add('drag-over');
  }
}

function clearAllDropIndicators() {
  document.querySelectorAll('.drag-over, .drop-insertion-indicator, .drop-above, .drop-below').forEach(el => {
    el.classList.remove('drag-over', 'drop-insertion-indicator', 'drop-above', 'drop-below');
  });
}

function showDropZoneIndicator(x, y, isValid) {
  if (!dropZoneIndicator) return;
  
  dropZoneIndicator.style.left = x + 15 + 'px';
  dropZoneIndicator.style.top = y - 30 + 'px';
  dropZoneIndicator.classList.remove('hidden');
  
  const content = dropZoneIndicator.querySelector('.drop-zone-content');
  if (isValid) {
    dropZoneIndicator.style.backgroundColor = 'var(--color-success)';
    content.innerHTML = '<span class="drop-zone-icon">✅</span><span class="drop-zone-text">Drop here</span>';
  } else {
    dropZoneIndicator.style.backgroundColor = 'var(--color-error)';
    content.innerHTML = '<span class="drop-zone-icon">❌</span><span class="drop-zone-text">Invalid drop</span>';
  }
}

function hideDropZoneIndicator() {
  if (dropZoneIndicator) {
    dropZoneIndicator.classList.add('hidden');
  }
}

// Handle Component Drop - Enhanced for better positioning
function handleComponentDrop(componentEl, dropTarget, position) {
  const template = appData.sectionTemplates.find(t => t.id === componentEl.dataset.id);
  const itemData = {
    id: generateId(),
    name: componentEl.dataset.name,
    icon: componentEl.dataset.icon,
    type: componentEl.dataset.type,
    originalId: componentEl.dataset.id,
    allowsContent: componentEl.dataset.allowsContent === 'true',
    preloadedContent: template?.preloadedContent || []
  };

  if (dropTarget.classList.contains('canvas') || dropTarget.classList.contains('canvas-section')) {
    if (itemData.type === 'section') {
      createCanvasSection(itemData, dropTarget, position);
    }
  } else if (dropTarget.classList.contains('section-content')) {
    createContentInContainer(itemData, dropTarget, position);
  } else if (dropTarget.classList.contains('subsection-content')) {
    createContentInContainer(itemData, dropTarget, position);
  }
}

// Canvas Management - Enhanced with preloaded content
function createCanvasSection(itemData, dropTarget, position) {
  const sectionEl = document.createElement('div');
  sectionEl.className = `canvas-section ${!itemData.allowsContent ? 'special-section' : ''}`;
  sectionEl.dataset.id = itemData.id;
  sectionEl.dataset.type = 'section';
  sectionEl.draggable = true;

  sectionEl.innerHTML = `
    <div class="section-header">
      <div class="section-title" data-name="${itemData.name}">
        <span class="component-icon">${itemData.icon}</span>
        <span class="section-name">${itemData.name}</span>
      </div>
      <div class="section-controls">
        <button class="control-btn" title="Move">↕️</button>
        <button class="control-btn" title="Delete">🗑️</button>
      </div>
    </div>
    <div class="section-content empty"></div>
  `;

  // Handle positioning
  if (position === 'above' && dropTarget.classList.contains('canvas-section')) {
    dropTarget.parentNode.insertBefore(sectionEl, dropTarget);
  } else if (position === 'below' && dropTarget.classList.contains('canvas-section')) {
    dropTarget.parentNode.insertBefore(sectionEl, dropTarget.nextSibling);
  } else {
    canvasEl.appendChild(sectionEl);
  }
  
  // Add to canvas data with preloaded content
  const sectionData = {
    id: itemData.id,
    name: itemData.name,
    icon: itemData.icon,
    type: 'section',
    allowsContent: itemData.allowsContent,
    summaryForStudents: '',
    notesForDeveloper: '',
    content: []
  };

  // Add preloaded content
  if (itemData.preloadedContent && itemData.preloadedContent.length > 0) {
    const sectionContent = sectionEl.querySelector('.section-content');
    sectionContent.classList.remove('empty');
    
    itemData.preloadedContent.forEach(preloadedItem => {
      const contentData = {
        id: generateId(),
        name: preloadedItem.name,
        icon: preloadedItem.icon,
        type: preloadedItem.type,
        description: '',
        approxLearningTime: '',
        summaryForStudents: '',
        notesForDeveloper: '',
        content: preloadedItem.type === 'subsection' ? [] : undefined
      };
      
      let contentEl;
      if (preloadedItem.type === 'subsection') {
        contentEl = createSubsectionElement(contentData);
      } else {
        contentEl = createContentElement(contentData);
      }
      
      sectionContent.appendChild(contentEl);
      sectionData.content.push(contentData);
    });
  }

  // Insert into data array at correct position
  if (position === 'above' && dropTarget.classList.contains('canvas-section')) {
    const targetIndex = canvasData.sections.findIndex(s => s.id === dropTarget.dataset.id);
    canvasData.sections.splice(targetIndex, 0, sectionData);
  } else if (position === 'below' && dropTarget.classList.contains('canvas-section')) {
    const targetIndex = canvasData.sections.findIndex(s => s.id === dropTarget.dataset.id);
    canvasData.sections.splice(targetIndex + 1, 0, sectionData);
  } else {
    canvasData.sections.push(sectionData);
  }

  saveCanvasData();
}

function createContentInContainer(itemData, container, position) {
  let contentEl;
  
  if (itemData.type === 'subsection') {
    contentEl = createSubsectionElement(itemData);
  } else {
    contentEl = createContentElement(itemData);
  }
  
  // Handle positioning within container
  if (position === 'above' || position === 'below') {
    const targetItem = container.querySelector('.content-item, .canvas-subsection');
    if (targetItem) {
      if (position === 'above') {
        container.insertBefore(contentEl, targetItem);
      } else {
        container.insertBefore(contentEl, targetItem.nextSibling);
      }
    } else {
      container.appendChild(contentEl);
    }
  } else {
    container.appendChild(contentEl);
  }
  
  container.classList.remove('empty');
  
  // Add to canvas data
  const contentData = createContentData(itemData);
  addToParentContent(container, contentData, position);
  
  saveCanvasData();
}

function createSubsectionElement(itemData) {
  const subsectionEl = document.createElement('div');
  subsectionEl.className = 'canvas-subsection';
  subsectionEl.dataset.id = itemData.id;
  subsectionEl.dataset.type = 'subsection';
  subsectionEl.draggable = true;

  subsectionEl.innerHTML = `
    <div class="subsection-header">
      <div class="subsection-title" data-name="${itemData.name}">
        <span class="component-icon">📋</span>
        <span class="subsection-name">${itemData.name}</span>
      </div>
      <div class="subsection-controls">
        <button class="control-btn" title="Move">↕️</button>
        <button class="control-btn" title="Delete">🗑️</button>
      </div>
    </div>
    <div class="subsection-content empty"></div>
  `;

  return subsectionEl;
}

function createContentElement(itemData) {
  const contentEl = document.createElement('div');
  contentEl.className = 'content-item';
  contentEl.dataset.id = itemData.id;
  contentEl.dataset.type = itemData.type;
  contentEl.draggable = true;

  contentEl.innerHTML = `
    <div class="content-title" data-name="${itemData.name}">
      <span class="component-icon">${itemData.icon}</span>
      <span class="content-name">${itemData.name}</span>
    </div>
    <div class="section-controls">
      <button class="control-btn" title="Move">↕️</button>
      <button class="control-btn" title="Delete">🗑️</button>
    </div>
  `;

  return contentEl;
}

function createContentData(itemData) {
  const baseData = {
    id: itemData.id,
    name: itemData.name,
    icon: itemData.icon,
    type: itemData.type
  };
  
  if (itemData.type === 'subsection') {
    return {
      ...baseData,
      summaryForStudents: '',
      notesForDeveloper: '',
      content: []
    };
  } else if (itemData.type === 'resource' || itemData.type === 'activity') {
    return {
      ...baseData,
      description: '',
      approxLearningTime: ''
    };
  } else {
    return baseData;
  }
}

function addToParentContent(container, contentData, position) {
  if (container.classList.contains('section-content')) {
    const sectionEl = container.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    if (section) {
      if (position === 'above' || position === 'below') {
        // Handle specific positioning
        const targetItem = container.querySelector('.content-item, .canvas-subsection');
        if (targetItem) {
          const targetIndex = section.content.findIndex(item => item.id === targetItem.dataset.id);
          const insertIndex = position === 'above' ? targetIndex : targetIndex + 1;
          section.content.splice(insertIndex, 0, contentData);
        } else {
          section.content.push(contentData);
        }
      } else {
        section.content.push(contentData);
      }
    }
  } else if (container.classList.contains('subsection-content')) {
    const subsectionEl = container.closest('.canvas-subsection');
    const subsectionId = subsectionEl.dataset.id;
    const sectionEl = subsectionEl.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    const subsection = section?.content?.find(item => item.id === subsectionId);
    if (subsection) {
      if (position === 'above' || position === 'below') {
        const targetItem = container.querySelector('.content-item');
        if (targetItem) {
          const targetIndex = subsection.content.findIndex(item => item.id === targetItem.dataset.id);
          const insertIndex = position === 'above' ? targetIndex : targetIndex + 1;
          subsection.content.splice(insertIndex, 0, contentData);
        } else {
          subsection.content.push(contentData);
        }
      } else {
        subsection.content.push(contentData);
      }
    }
  }
}

// Enhanced Move Menu System - Fixed for proper hierarchical display and functionality
function showMoveMenu(element) {
  currentMoveElement = element;
  const elementName = getCurrentDisplayName(element) || 'Unknown Item';
  
  document.getElementById('move-item-name').textContent = elementName;
  
  // Build hierarchical move list
  buildMoveList();
  
  moveModal.classList.remove('hidden');
}

function buildMoveList() {
  const moveList = document.getElementById('move-list');
  moveList.innerHTML = '';
  
  if (canvasData.sections.length === 0) {
    moveList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No content available to move to.</p>';
    return;
  }
  
  // Add "Move to beginning" option
  const beginningItem = createMoveItem('beginning', 'Move to beginning', '↑', 0, false);
  moveList.appendChild(beginningItem);
  
  const separator = document.createElement('div');
  separator.className = 'move-separator';
  moveList.appendChild(separator);
  
  // Build hierarchical list
  canvasData.sections.forEach((section) => {
    const sectionItem = createMoveItem(section.id, section.name, section.icon, 0, section.id === currentMoveElement?.dataset.id);
    moveList.appendChild(sectionItem);
    
    if (section.content && section.content.length > 0) {
      section.content.forEach((item) => {
        const contentItem = createMoveItem(item.id, item.name, item.icon, 1, item.id === currentMoveElement?.dataset.id);
        moveList.appendChild(contentItem);
        
        // If it's a subsection, show its content
        if (item.type === 'subsection' && item.content && item.content.length > 0) {
          item.content.forEach((subItem) => {
            const subContentItem = createMoveItem(subItem.id, subItem.name, subItem.icon, 2, subItem.id === currentMoveElement?.dataset.id);
            moveList.appendChild(subContentItem);
          });
        }
      });
    }
  });
}

function createMoveItem(id, name, icon, indentLevel, isDisabled) {
  const item = document.createElement('div');
  item.className = `move-item ${isDisabled ? 'disabled' : ''}`;
  if (indentLevel === 1) item.classList.add('move-item-indent');
  if (indentLevel === 2) item.classList.add('move-item-indent-2');
  
  item.innerHTML = `
    <div class="move-item-content">
      <span class="move-item-icon">${icon}</span>
      <span>${name}</span>
    </div>
  `;
  
  if (!isDisabled) {
    item.addEventListener('click', () => moveElementTo(id));
  }
  
  return item;
}

function moveElementTo(targetId) {
  if (!currentMoveElement) return;
  
  // Remove element from current location
  const elementData = getElementData(currentMoveElement);
  removeFromParentContent(currentMoveElement);
  
  // Add element to new location
  if (targetId === 'beginning') {
    // Move to beginning of canvas
    if (currentMoveElement.classList.contains('canvas-section')) {
      const firstSection = canvasEl.querySelector('.canvas-section');
      if (firstSection && firstSection !== currentMoveElement) {
        canvasEl.insertBefore(currentMoveElement, firstSection);
        // Update data structure
        const elementIndex = canvasData.sections.findIndex(s => s.id === currentMoveElement.dataset.id);
        if (elementIndex > -1) {
          const [element] = canvasData.sections.splice(elementIndex, 1);
          canvasData.sections.unshift(element);
        }
      }
    }
  } else {
    // Move after the specified element
    moveAfterElement(currentMoveElement, targetId, elementData);
  }
  
  saveCanvasData();
  closeMoveModal();
}

function moveAfterElement(element, targetId, elementData) {
  // Find target element and insert after it
  const targetElement = findElementById(targetId);
  if (!targetElement) return;
  
  // Determine where to insert based on target element type
  if (targetElement.classList.contains('canvas-section')) {
    // Insert after section
    if (element.classList.contains('canvas-section')) {
      targetElement.parentNode.insertBefore(element, targetElement.nextSibling);
      // Update data
      const elementIndex = canvasData.sections.findIndex(s => s.id === element.dataset.id);
      const targetIndex = canvasData.sections.findIndex(s => s.id === targetId);
      if (elementIndex > -1 && targetIndex > -1) {
        const [movedElement] = canvasData.sections.splice(elementIndex, 1);
        canvasData.sections.splice(targetIndex + 1, 0, movedElement);
      }
    } else {
      // Insert content into section
      const sectionContent = targetElement.querySelector('.section-content');
      sectionContent.appendChild(element);
      sectionContent.classList.remove('empty');
      
      // Update data
      const sectionId = targetElement.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      if (section) {
        section.content.push(elementData);
      }
    }
  } else {
    // Insert after other content
    const parent = targetElement.parentElement;
    parent.insertBefore(element, targetElement.nextSibling);
    
    // Update data structure
    updateDataAfterMove(element, parent, elementData, targetId);
  }
}

function findElementById(id) {
  return document.querySelector(`[data-id="${id}"]`);
}

function updateDataAfterMove(element, newParent, elementData, targetId) {
  if (newParent.classList.contains('section-content')) {
    const sectionEl = newParent.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    if (section) {
      const targetIndex = section.content.findIndex(item => item.id === targetId);
      section.content.splice(targetIndex + 1, 0, elementData);
    }
  } else if (newParent.classList.contains('subsection-content')) {
    const subsectionEl = newParent.closest('.canvas-subsection');
    const subsectionId = subsectionEl.dataset.id;
    const sectionEl = subsectionEl.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    const subsection = section?.content?.find(item => item.id === subsectionId);
    if (subsection) {
      const targetIndex = subsection.content.findIndex(item => item.id === targetId);
      subsection.content.splice(targetIndex + 1, 0, elementData);
    }
  }
}

function closeMoveModal() {
  moveModal.classList.add('hidden');
  currentMoveElement = null;
}

// Enhanced Delete Functionality with Confirmation
function showDeleteConfirmation(element) {
  currentDeleteElement = element;
  const elementName = getCurrentDisplayName(element) || 'Unknown Item';
  
  document.getElementById('delete-item-name').textContent = elementName;
  deleteModal.classList.remove('hidden');
}

function confirmDelete() {
  if (!currentDeleteElement) return;
  
  deleteItem(currentDeleteElement);
  closeDeleteModal();
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  currentDeleteElement = null;
}

function deleteItem(element) {
  const elementId = element.dataset.id;
  
  if (element.classList.contains('canvas-section')) {
    // Remove from canvas data
    canvasData.sections = canvasData.sections.filter(s => s.id !== elementId);
  } else {
    // Remove from parent content array
    removeFromParentContent(element);
  }
  
  element.remove();
  saveCanvasData();
  clearSelection();
  
  // Show placeholder if canvas is empty
  if (canvasEl.querySelectorAll('.canvas-section').length === 0) {
    canvasPlaceholder.style.display = 'flex';
  }
}

function removeFromParentContent(element) {
  const elementId = element.dataset.id;
  const parentContentEl = element.parentElement;
  
  if (parentContentEl.classList.contains('section-content')) {
    // Remove from section content
    const sectionEl = parentContentEl.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    if (section) {
      section.content = section.content.filter(item => item.id !== elementId);
    }
    
    // Check if section is now empty
    if (parentContentEl.children.length === 1) {
      parentContentEl.classList.add('empty');
    }
  } else if (parentContentEl.classList.contains('subsection-content')) {
    // Remove from subsection content
    const subsectionEl = parentContentEl.closest('.canvas-subsection');
    const subsectionId = subsectionEl.dataset.id;
    const sectionEl = subsectionEl.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    const subsection = section?.content?.find(item => item.id === subsectionId);
    
    if (subsection) {
      subsection.content = subsection.content.filter(item => item.id !== elementId);
    }
    
    // Check if subsection is now empty
    if (parentContentEl.children.length === 1) {
      parentContentEl.classList.add('empty');
    }
  }
}

// Context Menu - Updated for new functionality
function handleContextMenu(e) {
  const target = e.target.closest('.canvas-section, .canvas-subsection, .content-item');
  if (target) {
    e.preventDefault();
    contextMenuTarget = target;
    
    contextMenu.style.left = e.clientX + 'px';
    contextMenu.style.top = e.clientY + 'px';
    contextMenu.classList.remove('hidden');
  }
}

function hideContextMenu() {
  contextMenu.classList.add('hidden');
  contextMenuTarget = null;
}

function openMoveMenuFromContext() {
  if (contextMenuTarget) {
    showMoveMenu(contextMenuTarget);
  }
  hideContextMenu();
}

function openDeleteConfirmationFromContext() {
  if (contextMenuTarget) {
    showDeleteConfirmation(contextMenuTarget);
  }
  hideContextMenu();
}

// Enhanced existing element move handler for bidirectional support
function handleExistingElementMove(element, dropTarget, position) {
  const parentEl = element.parentElement;
  
  // Remove from current parent data
  const elementData = getElementData(element);
  removeFromParentContent(element);
  
  // Handle different drop scenarios with positioning
  if (dropTarget.classList.contains('canvas') || dropTarget.classList.contains('canvas-section')) {
    if (element.classList.contains('canvas-section')) {
      // Moving sections within canvas
      if (position === 'above') {
        dropTarget.parentNode.insertBefore(element, dropTarget);
      } else if (position === 'below') {
        dropTarget.parentNode.insertBefore(element, dropTarget.nextSibling);
      }
      
      // Update data array
      const elementIndex = canvasData.sections.findIndex(s => s.id === element.dataset.id);
      const targetIndex = canvasData.sections.findIndex(s => s.id === dropTarget.dataset.id);
      
      if (elementIndex > -1 && targetIndex > -1) {
        const [movedElement] = canvasData.sections.splice(elementIndex, 1);
        const newIndex = position === 'above' ? targetIndex : targetIndex + 1;
        canvasData.sections.splice(newIndex, 0, movedElement);
      }
    }
  } else {
    // Moving content within containers
    if (position === 'above' || position === 'below') {
      const referenceElement = dropTarget.querySelector('.content-item, .canvas-subsection');
      if (referenceElement) {
        if (position === 'above') {
          dropTarget.insertBefore(element, referenceElement);
        } else {
          dropTarget.insertBefore(element, referenceElement.nextSibling);
        }
      } else {
        dropTarget.appendChild(element);
      }
    } else {
      dropTarget.appendChild(element);
    }
    
    dropTarget.classList.remove('empty');
    addToParentContent(dropTarget, elementData, position);
  }
  
  // Check if old parent is now empty
  if (parentEl && parentEl.children.length === 0 && 
      (parentEl.classList.contains('section-content') || parentEl.classList.contains('subsection-content'))) {
    parentEl.classList.add('empty');
  }
  
  saveCanvasData();
}

// Element Selection and Properties Management
function selectElement(element) {
  // Clear previous selection
  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  
  // Select current element
  element.classList.add('selected');
  selectedElement = element;
  
  // Update properties panel
  updatePropertiesPanel(element);
}

function clearSelection() {
  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  selectedElement = null;
  propertiesContent.innerHTML = '<p class="properties-empty">Select an item to edit its properties.</p>';
}

function updatePropertiesPanel(element) {
  const elementType = getElementType(element);
  const elementData = getElementData(element);
  const fields = appData.propertyFields[elementType] || [];
  
  // Get current display name for smart default
  const currentDisplayName = getCurrentDisplayName(element);
  
  let html = '<form class="properties-form">';
  
  fields.forEach(field => {
    const label = formatFieldLabel(field);
    let value = elementData[field] || '';
    
    // Smart default for name field - use current display name if no stored value
    if (field === 'name' && !value && currentDisplayName) {
      value = currentDisplayName;
    }
    
    if (field === 'description' || field === 'summaryForStudents' || field === 'notesForDeveloper') {
      html += `
        <div class="form-group">
          <label class="form-label" for="prop-${field}">${label}</label>
          <textarea class="form-control" id="prop-${field}" placeholder="Enter ${label.toLowerCase()}">${value}</textarea>
        </div>
      `;
    } else {
      html += `
        <div class="form-group">
          <label class="form-label" for="prop-${field}">${label}</label>
          <input type="text" class="form-control" id="prop-${field}" placeholder="Enter ${label.toLowerCase()}" value="${value}">
        </div>
      `;
    }
  });
  
  html += '</form>';
  propertiesContent.innerHTML = html;
  
  // Add event listeners to form fields
  const form = propertiesContent.querySelector('.properties-form');
  if (form) {
    form.addEventListener('input', function(e) {
      const fieldName = e.target.id.replace('prop-', '');
      const fieldValue = e.target.value;
      updateElementData(element, fieldName, fieldValue);
    });
  }
}

function getCurrentDisplayName(element) {
  if (element.classList.contains('canvas-section')) {
    const nameEl = element.querySelector('.section-name');
    return nameEl ? nameEl.textContent : null;
  } else if (element.classList.contains('canvas-subsection')) {
    const nameEl = element.querySelector('.subsection-name');
    return nameEl ? nameEl.textContent : null;
  } else if (element.classList.contains('content-item')) {
    const nameEl = element.querySelector('.content-name');
    return nameEl ? nameEl.textContent : null;
  }
  return null;
}

function formatFieldLabel(field) {
  const labels = {
    'name': 'Name',
    'summaryForStudents': 'Summary for Students',
    'notesForDeveloper': 'Notes for Developer',
    'description': 'Description',
    'approxLearningTime': 'Approx. Learning Time'
  };
  return labels[field] || field;
}

function getElementType(element) {
  if (element.classList.contains('canvas-section')) {
    return 'section';
  } else if (element.classList.contains('canvas-subsection')) {
    return 'subsection';
  } else if (element.classList.contains('content-item')) {
    return element.dataset.type;
  }
  return null;
}

function getElementData(element) {
  const elementId = element.dataset.id;
  
  if (element.classList.contains('canvas-section')) {
    return canvasData.sections.find(s => s.id === elementId) || {};
  } else if (element.classList.contains('canvas-subsection')) {
    const sectionEl = element.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    return section?.content?.find(item => item.id === elementId) || {};
  } else if (element.classList.contains('content-item')) {
    const parentEl = element.parentElement.closest('.canvas-section, .canvas-subsection');
    if (parentEl.classList.contains('canvas-section')) {
      const sectionId = parentEl.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      return section?.content?.find(item => item.id === elementId) || {};
    } else {
      const subsectionId = parentEl.dataset.id;
      const sectionEl = parentEl.closest('.canvas-section');
      const sectionId = sectionEl.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      const subsection = section?.content?.find(item => item.id === subsectionId);
      return subsection?.content?.find(item => item.id === elementId) || {};
    }
  }
  
  return {};
}

function updateElementData(element, fieldName, fieldValue) {
  const elementId = element.dataset.id;
  
  if (element.classList.contains('canvas-section')) {
    const section = canvasData.sections.find(s => s.id === elementId);
    if (section) {
      section[fieldName] = fieldValue;
      if (fieldName === 'name') {
        const nameEl = element.querySelector('.section-name');
        if (nameEl) nameEl.textContent = fieldValue;
      }
    }
  } else if (element.classList.contains('canvas-subsection')) {
    const sectionEl = element.closest('.canvas-section');
    const sectionId = sectionEl.dataset.id;
    const section = canvasData.sections.find(s => s.id === sectionId);
    const subsection = section?.content?.find(item => item.id === elementId);
    if (subsection) {
      subsection[fieldName] = fieldValue;
      if (fieldName === 'name') {
        const nameEl = element.querySelector('.subsection-name');
        if (nameEl) nameEl.textContent = fieldValue;
      }
    }
  } else if (element.classList.contains('content-item')) {
    const parentEl = element.parentElement.closest('.canvas-section, .canvas-subsection');
    let targetContent;
    
    if (parentEl.classList.contains('canvas-section')) {
      const sectionId = parentEl.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      targetContent = section?.content?.find(item => item.id === elementId);
    } else {
      const subsectionId = parentEl.dataset.id;
      const sectionEl = parentEl.closest('.canvas-section');
      const sectionId = sectionEl.dataset.id;
      const section = canvasData.sections.find(s => s.id === sectionId);
      const subsection = section?.content?.find(item => item.id === subsectionId);
      targetContent = subsection?.content?.find(item => item.id === elementId);
    }
    
    if (targetContent) {
      targetContent[fieldName] = fieldValue;
      if (fieldName === 'name') {
        const nameEl = element.querySelector('.content-name');
        if (nameEl) nameEl.textContent = fieldValue;
      }
    }
  }
  
  saveCanvasData();
}

// Toolbar Functions
function saveCanvas() {
  saveCanvasData();
  alert('Canvas saved successfully!');
}

function clearCanvas() {
  if (confirm('Are you sure you want to clear the entire canvas? This action cannot be undone.')) {
    canvasData = { sections: [], customCounter: 0 };
    canvasEl.innerHTML = '';
    canvasEl.appendChild(canvasPlaceholder);
    canvasPlaceholder.style.display = 'flex';
    clearSelection();
    saveCanvasData();
  }
}

// Enhanced PDF Export Function - Text Only with Proper Indentation
function exportCanvasToPDF() {
  if (canvasData.sections.length === 0) {
    alert('Please add some content to export.');
    return;
  }

  document.body.classList.add('exporting');
  
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // PDF Configuration
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = margin;
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('LMS Course Wireframe', margin, yPosition);
    yPosition += 15;
    
    // Date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;
    
    // Process each section
    canvasData.sections.forEach((section) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Section Header (No indentation)
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(`${section.name}`, margin, yPosition);
      yPosition += 8;
      
      // Section properties with single indentation
      if (section.summaryForStudents) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const summaryLines = doc.splitTextToSize(`    Summary: ${section.summaryForStudents}`, pageWidth - margin * 2);
        doc.text(summaryLines, margin, yPosition);
        yPosition += 6 * summaryLines.length;
      }
      
      if (section.notesForDeveloper) {
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        const notesLines = doc.splitTextToSize(`    Developer Notes: ${section.notesForDeveloper}`, pageWidth - margin * 2);
        doc.text(notesLines, margin, yPosition);
        yPosition += 6 * notesLines.length;
      }
      
      yPosition += 5;
      
      // Section border
      doc.setDrawColor(33, 128, 141);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      
      // Process section content with proper indentation
      if (section.content && section.content.length > 0) {
        section.content.forEach((item) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = margin;
          }
          
          yPosition = renderContentItemWithIndentation(doc, item, margin, yPosition, pageHeight, 1);
        });
      } else {
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text('    (No content)', margin, yPosition);
        yPosition += 8;
      }
      
      yPosition += 15;
    });
    
    // Footer on each page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
      doc.text('Generated by LMS Wireframe Builder', margin, pageHeight - 10);
    }
    
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `lms-wireframe-${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    document.body.classList.remove('exporting');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
    document.body.classList.remove('exporting');
  }
}

function renderContentItemWithIndentation(doc, item, baseMargin, y, pageHeight, indentLevel) {
  let yPosition = y;
  const indent = '    '.repeat(indentLevel);
  
  if (item.type === 'subsection') {
    // Subsection Header with single indentation
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`${indent}${item.name}`, baseMargin, yPosition);
    yPosition += 8;
    
    // Subsection properties with double indentation
    const subIndent = '    '.repeat(indentLevel + 1);
    if (item.summaryForStudents) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const summaryLines = doc.splitTextToSize(`${subIndent}Summary: ${item.summaryForStudents}`, 180 - baseMargin);
      doc.text(summaryLines, baseMargin, yPosition);
      yPosition += 6 * summaryLines.length;
    }
    
    if (item.notesForDeveloper) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      const notesLines = doc.splitTextToSize(`${subIndent}Developer Notes: ${item.notesForDeveloper}`, 180 - baseMargin);
      doc.text(notesLines, baseMargin, yPosition);
      yPosition += 6 * notesLines.length;
    }
    
    yPosition += 5;
    
    // Subsection content with double indentation
    if (item.content && item.content.length > 0) {
      item.content.forEach((subItem) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        yPosition = renderContentItemWithIndentation(doc, subItem, baseMargin, yPosition, pageHeight, indentLevel + 1);
      });
    }
    
  } else if (item.type === 'design-element') {
    // Design Element with proper indentation
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`${indent}--- ${item.name.toUpperCase()} ---`, baseMargin, yPosition);
    yPosition += 10;
    
  } else {
    // Resource or Activity with proper indentation
    const typeLabel = item.type === 'resource' ? 'RESOURCE' : 'ACTIVITY';
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`${indent}- ${item.name} (${typeLabel})`, baseMargin, yPosition);
    yPosition += 6;
    
    // Content properties with additional indentation
    const contentIndent = '    '.repeat(indentLevel + 1);
    if (item.description) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(`${contentIndent}Description: ${item.description}`, 180 - baseMargin);
      doc.text(descLines, baseMargin, yPosition);
      yPosition += 6 * descLines.length;
    }
    
    if (item.approxLearningTime) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text(`${contentIndent}Learning Time: ${item.approxLearningTime}`, baseMargin, yPosition);
      yPosition += 6;
    }
    
    yPosition += 3;
  }
  
  return yPosition;
}

// Custom Element Creation
function addCustomSection() {
  const name = prompt('Enter section name:');
  if (!name) return;
  
  const itemData = {
    id: generateId(),
    name: name,
    icon: '📁',
    type: 'section',
    allowsContent: true,
    preloadedContent: []
  };
  
  createCanvasSection(itemData, canvasEl, 'inside');
  canvasPlaceholder.style.display = 'none';
}

function addCustomSubsection() {
  const sections = document.querySelectorAll('.canvas-section:not(.special-section)');
  if (sections.length === 0) {
    alert('Please create a regular section first before adding a subsection.');
    return;
  }
  
  const name = prompt('Enter subsection name:');
  if (!name) return;
  
  const itemData = {
    id: generateId(),
    name: name,
    icon: '📋',
    type: 'subsection'
  };
  
  // Add to first available section
  const sectionContent = sections[0].querySelector('.section-content');
  createContentInContainer(itemData, sectionContent, 'inside');
}

function addCustomResource() {
  const sections = document.querySelectorAll('.canvas-section:not(.special-section)');
  if (sections.length === 0) {
    alert('Please create a section first before adding resources.');
    return;
  }
  
  const name = prompt('Enter resource name:');
  if (!name) return;
  
  const itemData = {
    id: generateId(),
    name: name,
    icon: '📄',
    type: 'resource'
  };
  
  // Add to first available section
  const sectionContent = sections[0].querySelector('.section-content');
  createContentInContainer(itemData, sectionContent, 'inside');
}

function addCustomActivity() {
  const sections = document.querySelectorAll('.canvas-section:not(.special-section)');
  if (sections.length === 0) {
    alert('Please create a section first before adding activities.');
    return;
  }
  
  const name = prompt('Enter activity name:');
  if (!name) return;
  
  const itemData = {
    id: generateId(),
    name: name,
    icon: '⚡',
    type: 'activity'
  };
  
  // Add to first available section
  const sectionContent = sections[0].querySelector('.section-content');
  createContentInContainer(itemData, sectionContent, 'inside');
}

// Utility Functions
function generateId() {
  return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveCanvasData() {
  localStorage.setItem('lms_wireframe_canvas', JSON.stringify(canvasData));
}

function loadCanvasData() {
  const saved = localStorage.getItem('lms_wireframe_canvas');
  if (saved) {
    try {
      canvasData = JSON.parse(saved);
      renderCanvas();
    } catch (e) {
      console.error('Error loading saved data:', e);
      canvasData = { sections: [], customCounter: 0 };
    }
  }
}

function renderCanvas() {
  canvasEl.innerHTML = '';
  
  if (canvasData.sections.length === 0) {
    canvasEl.appendChild(canvasPlaceholder);
    canvasPlaceholder.style.display = 'flex';
    return;
  }
  
  canvasData.sections.forEach(sectionData => {
    const sectionEl = document.createElement('div');
    sectionEl.className = `canvas-section ${!sectionData.allowsContent ? 'special-section' : ''}`;
    sectionEl.dataset.id = sectionData.id;
    sectionEl.dataset.type = 'section';
    sectionEl.draggable = true;

    sectionEl.innerHTML = `
      <div class="section-header">
        <div class="section-title" data-name="${sectionData.name}">
          <span class="component-icon">${sectionData.icon}</span>
          <span class="section-name">${sectionData.name}</span>
        </div>
        <div class="section-controls">
          <button class="control-btn" title="Move">↕️</button>
          <button class="control-btn" title="Delete">🗑️</button>
        </div>
      </div>
      <div class="section-content ${!sectionData.content || sectionData.content.length === 0 ? 'empty' : ''}"></div>
    `;

    const sectionContent = sectionEl.querySelector('.section-content');
    
    if (sectionData.content && sectionData.content.length > 0) {
      sectionData.content.forEach(contentData => {
        let contentEl;
        
        if (contentData.type === 'subsection') {
          contentEl = createSubsectionElement(contentData);
          const subsectionContent = contentEl.querySelector('.subsection-content');
          
          if (contentData.content && contentData.content.length > 0) {
            contentData.content.forEach(subContentData => {
              const subContentEl = createContentElement(subContentData);
              subsectionContent.appendChild(subContentEl);
            });
            subsectionContent.classList.remove('empty');
          }
        } else {
          contentEl = createContentElement(contentData);
        }
        
        sectionContent.appendChild(contentEl);
      });
    }

    canvasEl.appendChild(sectionEl);
  });
  
  canvasEl.appendChild(canvasPlaceholder);
  canvasPlaceholder.style.display = 'none';
}