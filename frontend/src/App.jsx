import { useEffect, useState } from "react";
import axios from "axios";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";
import "./App.css";

const API_URL = "http://localhost:5000";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;


// Family Tree Flow Component
function FamilyTreeFlow({
  nodes,
  edges,
  selectedMember,
  onSelectMember,
}) {

  const handleNodeClick = (_, node) => {
    const member = nodes.find(
      (n) => n.id === node.id
    )?.member;

    if (member) {
      onSelectMember(member);
    }
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      onNodeClick={handleNodeClick}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}

function App() {
  const [members, setMembers] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
  name: "",
  phone: "",
  email: "",
  location: "",
  gender: "",
  date_of_birth: "",
  photo_url: "",
});
  const [addingMember, setAddingMember] = useState(false);
  const handleAddMember = async (e) => {
  e.preventDefault();

  if (!newMember.name.trim()) {
    alert("Name is required");
    return;
  }

  try {
    setAddingMember(true);

    const response = await axios.post(
      `${API_URL}/api/members`,
      newMember
    );

    const addedMember = response.data.member;

    setMembers((prev) => [
      ...prev,
      addedMember,cod
    ]);

    setNewMember({
      name: "",
      phone: "",
      email: "",
      location: "",
      gender: "",
      date_of_birth: "",
      photo_url: "",
    });

    setShowAddMember(false);

    alert("Family member added successfully");
  } catch (error) {
    console.error("Failed to add member:", error);

    alert(
      error.response?.data?.error ||
        "Failed to add family member"
    );
  } finally {
    setAddingMember(false);
  }
};



  useEffect(() => {
    const loadFamilyData = async () => {
      try {
        const [membersResponse, relationshipsResponse] =
          await Promise.all([
            axios.get(`${API_URL}/api/members`),
            axios.get(`${API_URL}/api/relationships`),
          ]);

        setMembers(membersResponse.data.members);
        setRelationships(
          relationshipsResponse.data.relationships
        );
      } catch (error) {
        console.error(
          "Failed to load family data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadFamilyData();
  }, []);

  /*
   * -----------------------------------------
   * FAMILY RELATIONSHIPS
   * -----------------------------------------
   */

  const parentRelationships = relationships.filter(
    (r) =>
      r.relationship_type === "father" ||
      r.relationship_type === "mother"
  );

  const spouseRelationships = relationships.filter(
    (r) => r.relationship_type === "spouse"
  );

  /*
   * -----------------------------------------
   * SPOUSE MAP
   * -----------------------------------------
   */

  const spouseMap = {};

  spouseRelationships.forEach((relationship) => {
    spouseMap[relationship.member_id] =
      relationship.related_member_id;

    spouseMap[relationship.related_member_id] =
      relationship.member_id;
  });

  /*
   * -----------------------------------------
   * CREATE FAMILY UNITS
   *
   * Husband + wife = one unit
   * Single person = one unit
   * -----------------------------------------
   */

  const familyUnits = [];
  const memberToUnit = {};
  const usedMembers = new Set();

  members.forEach((member) => {
    if (usedMembers.has(member.id)) {
      return;
    }

    const spouseId = spouseMap[member.id];

    if (spouseId) {
      const spouse = members.find(
        (m) => m.id === spouseId
      );

      if (spouse) {
        const unit = {
          id: `family-${member.id}-${spouse.id}`,
          members: [member, spouse],
        };

        familyUnits.push(unit);

        memberToUnit[member.id] = unit;
        memberToUnit[spouse.id] = unit;

        usedMembers.add(member.id);
        usedMembers.add(spouse.id);

        return;
      }
    }

    const unit = {
      id: `family-${member.id}`,
      members: [member],
    };

    familyUnits.push(unit);
    memberToUnit[member.id] = unit;

    usedMembers.add(member.id);
  });

  /*
   * -----------------------------------------
   * PARENT → CHILD UNITS
   * -----------------------------------------
   */

  const unitParents = {};

  parentRelationships.forEach((relationship) => {
    const parentUnit =
      memberToUnit[relationship.member_id];

    const childUnit =
      memberToUnit[relationship.related_member_id];

    if (!parentUnit || !childUnit) {
      return;
    }

    if (parentUnit.id === childUnit.id) {
      return;
    }

    if (!unitParents[childUnit.id]) {
      unitParents[childUnit.id] = new Set();
    }

    unitParents[childUnit.id].add(parentUnit.id);
  });

  /*
   * -----------------------------------------
   * GENERATION CALCULATION
   * -----------------------------------------
   */

  const unitMap = {};

  familyUnits.forEach((unit) => {
    unitMap[unit.id] = unit;
  });

  const generationMap = {};
  const calculating = new Set();

  const getGeneration = (unitId) => {
    if (generationMap[unitId] !== undefined) {
      return generationMap[unitId];
    }

    if (calculating.has(unitId)) {
      return 0;
    }

    calculating.add(unitId);

    const parents = unitParents[unitId];

    if (!parents || parents.size === 0) {
      generationMap[unitId] = 0;
      calculating.delete(unitId);
      return 0;
    }

    let generation = 0;

    parents.forEach((parentId) => {
      const parentGeneration =
        getGeneration(parentId);

      generation = Math.max(
        generation,
        parentGeneration + 1
      );
    });

    generationMap[unitId] = generation;

    calculating.delete(unitId);

    return generation;
  };

  familyUnits.forEach((unit) => {
    getGeneration(unit.id);
  });

  /*
   * -----------------------------------------
   * GROUP BY GENERATION
   * -----------------------------------------
   */

  const generationGroups = {};

  familyUnits.forEach((unit) => {
    const generation =
      generationMap[unit.id] || 0;

    if (!generationGroups[generation]) {
      generationGroups[generation] = [];
    }

    generationGroups[generation].push(unit);
  });

   /*
   * -----------------------------------------
   * CREATE SEPARATE FAMILY GROUPS
   * -----------------------------------------
   */

  const unitGraph = {};

  familyUnits.forEach((unit) => {
    unitGraph[unit.id] = new Set();
  });

  Object.keys(unitParents).forEach((childUnitId) => {
    const parents = unitParents[childUnitId];

    parents.forEach((parentUnitId) => {
      if (!unitGraph[parentUnitId]) {
        unitGraph[parentUnitId] = new Set();
      }

      if (!unitGraph[childUnitId]) {
        unitGraph[childUnitId] = new Set();
      }

      unitGraph[parentUnitId].add(childUnitId);
      unitGraph[childUnitId].add(parentUnitId);
    });
  });

  /*
   * -----------------------------------------
   * FIND CONNECTED FAMILY COMPONENTS
   * -----------------------------------------
   */

  const components = [];
  const visitedUnits = new Set();

  familyUnits.forEach((startUnit) => {
    if (visitedUnits.has(startUnit.id)) {
      return;
    }

    const component = [];
    const queue = [startUnit.id];

    visitedUnits.add(startUnit.id);

    while (queue.length > 0) {
      const currentId = queue.shift();

      component.push(
        unitMap[currentId]
      );

      const neighbours =
        unitGraph[currentId] || new Set();

      neighbours.forEach((nextId) => {
        if (!visitedUnits.has(nextId)) {
          visitedUnits.add(nextId);
          queue.push(nextId);
        }
      });
    }

    components.push(component);
  });

  /*
   * -----------------------------------------
   * POSITION EACH FAMILY GROUP SEPARATELY
   * -----------------------------------------
   */

  const positions = {};

  const NODE_WIDTH = 180;
  const NODE_HEIGHT = 80;

  const SPOUSE_GAP = 35;
  const UNIT_GAP = 100;
  const GENERATION_GAP = 240;

  let componentOffsetX = 0;

  components.forEach((component) => {
    /*
     * Group units by generation
     */

    const componentGenerations = {};

    component.forEach((unit) => {
      const generation =
        generationMap[unit.id] || 0;

      if (!componentGenerations[generation]) {
        componentGenerations[generation] = [];
      }

      componentGenerations[generation].push(
        unit
      );
    });

    const generations = Object.keys(
      componentGenerations
    )
      .map(Number)
      .sort((a, b) => a - b);

    /*
     * Find maximum number of units
     */

    let maxUnits = 1;

    generations.forEach((generation) => {
      maxUnits = Math.max(
        maxUnits,
        componentGenerations[generation].length
      );
    });

    const componentWidth =
      maxUnits * 300;

    /*
     * Position every generation
     */

    generations.forEach((generation) => {
      const units =
        componentGenerations[generation];

      const totalWidth =
        units.reduce((total, unit) => {
          const unitWidth =
            unit.members.length === 2
              ? NODE_WIDTH * 2 + SPOUSE_GAP
              : NODE_WIDTH;

          return (
            total +
            unitWidth +
            UNIT_GAP
          );
        }, 0) - UNIT_GAP;

      let currentX =
        componentOffsetX +
        (componentWidth - totalWidth) / 2;

      units.forEach((unit) => {
        const unitWidth =
          unit.members.length === 2
            ? NODE_WIDTH * 2 + SPOUSE_GAP
            : NODE_WIDTH;

        /*
         * If parents exist, try to center
         * the family unit below them.
         */

        const parents =
          unitParents[unit.id];

        let parentCenter = null;

        if (parents && parents.size > 0) {
          const parentPositions = [
            ...parents,
          ]
            .map(
              (parentId) =>
                positions[parentId]
            )
            .filter(Boolean);

          if (
            parentPositions.length > 0
          ) {
            parentCenter =
              parentPositions.reduce(
                (sum, position) =>
                  sum + position.x,
                0
              ) /
              parentPositions.length;
          }
        }

        let x = currentX;

        if (parentCenter !== null) {
          x =
            parentCenter -
            unitWidth / 2;
        }

        positions[unit.id] = {
          x,
          y:
            generation *
            GENERATION_GAP,
          width: unitWidth,
        };

        currentX +=
          unitWidth + UNIT_GAP;
      });
    });

    /*
     * Prevent units from overlapping
     */

    generations.forEach((generation) => {
      const units =
        componentGenerations[generation];

      const sortedUnits = [...units].sort(
        (a, b) =>
          positions[a.id].x -
          positions[b.id].x
      );

      for (
        let i = 1;
        i < sortedUnits.length;
        i++
      ) {
        const previous =
          positions[
            sortedUnits[i - 1].id
          ];

        const current =
          positions[
            sortedUnits[i].id
          ];

        const minimumX =
          previous.x +
          previous.width +
          UNIT_GAP;

        if (current.x < minimumX) {
          current.x = minimumX;
        }
      }
    });

    /*
     * Move to next family group
     */

    componentOffsetX +=
      componentWidth + 400;
  });
  /*
   * -----------------------------------------
   * CREATE NODES
   * -----------------------------------------
   */
const searchResults = searchTerm.trim()
  ? members.filter((member) =>
      member.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  : [];

  const nodes = [];

  familyUnits.forEach((unit) => {
    const position = positions[unit.id];

    if (!position) {
      return;
    }

    if (unit.members.length === 2) {
      unit.members.forEach(
        (member, index) => {
          nodes.push({
            id: String(member.id),

            position: {
              x:
                position.x +
                index *
                  (NODE_WIDTH + 40),
              y: position.y,
            },
            member: member,

            style: {
              width: NODE_WIDTH,
              height: NODE_HEIGHT,

              border:
                selectedMember &&
                selectedMember.id === member.id
                  ? "3px solid #f59e0b"
                  : "none",

              boxShadow:
                selectedMember &&
                selectedMember.id === member.id
                  ? "0 0 20px rgba(245, 158, 11, 0.6)"
                  : "none",
            },

            data: {
              label: (
              <div
              className={`family-node ${
                selectedMember?.id === member.id
                  ? "selected-family-node"
                  : ""
              }`}
              onClick={() =>
                setSelectedMember(member)
              }
            >
                  <strong>
                    {member.name}
                  </strong>

                  <span>
                    {member.location}
                  </span>
                </div>
              ),
            },

            style: {
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
            },
          });
        }
      );
    } else {
      const member = unit.members[0];

      nodes.push({
        id: String(member.id),

        position: {
          x: position.x,
          y: position.y,
        },

        data: {
          label: (
            <div
              className={`family-node ${
                selectedMember?.id === member.id
                  ? "selected-family-node"
                  : ""
              }`}
              onClick={() =>
                setSelectedMember(member)
              }
            >
              <strong>
                {member.name}
              </strong>

              <span>
                {member.location}
              </span>
            </div>
          ),
        },

        style: {
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        },
      });
    }
  });

  /*
   * -----------------------------------------
   * CREATE EDGES
   * -----------------------------------------
   */

  /*
   * -----------------------------------------
   * FAMILY CONNECTOR NODES
   * -----------------------------------------
   */

  const connectorNodes = [];

  familyUnits.forEach((childUnit) => {
    const parents = unitParents[childUnit.id];

    if (!parents || parents.size === 0) {
      return;
    }

    const childPosition = positions[childUnit.id];

    if (!childPosition) {
      return;
    }

    connectorNodes.push({
      id: `connector-${childUnit.id}`,

      position: {
        x: childPosition.x,
        y: childPosition.y - 60,
      },

      data: {
        label: "",
      },

      style: {
        width: 2,
        height: 2,
        padding: 0,
        border: "none",
        background: "transparent",
        boxShadow: "none",
      },

      selectable: false,
      draggable: false,
    });
  });

  nodes.push(...connectorNodes);

  /*
   * -----------------------------------------
   * CREATE CLEAN FAMILY EDGES
   * -----------------------------------------
   */

  const edges = [];

  // Husband + wife
  spouseRelationships.forEach((relationship) => {
    edges.push({
      id: `spouse-${relationship.id}`,

      source: String(
        relationship.member_id
      ),

      target: String(
        relationship.related_member_id
      ),

      type: "smoothstep",

      label: "spouse",

      animated: true,

      style: {
        strokeWidth: 2,
      },
    });
  });

  // Parent → family connector
  parentRelationships.forEach((relationship) => {
    const childUnit =
      memberToUnit[
        relationship.related_member_id
      ];

    if (!childUnit) {
      return;
    }

    edges.push({
      id: `parent-${relationship.id}`,

      source: String(
        relationship.member_id
      ),

      target: `connector-${childUnit.id}`,

      type: "smoothstep",

      label: relationship.relationship_type,

      style: {
        strokeWidth: 1.5,
      },
    });
  });

  // Family connector → children
  familyUnits.forEach((childUnit) => {
    const parents = unitParents[childUnit.id];

    if (!parents || parents.size === 0) {
      return;
    }

    childUnit.members.forEach((child) => {
      edges.push({
        id: `child-${childUnit.id}-${child.id}`,

        source: `connector-${childUnit.id}`,

        target: String(child.id),

        type: "smoothstep",

        style: {
          strokeWidth: 1.5,
        },
      });
    });
  });

  /*
   * -----------------------------------------
   * LOADING
   * -----------------------------------------
   */

  if (loading) {
    return (
      <div className="loading">
        Loading Family Tree...
      </div>
    );
  }

  /*
   * -----------------------------------------
   * UI
   * -----------------------------------------
   */

  return (
    <div className="app">

<header className="header">
  <div>
    <h1>Family Tree</h1>

    <p>
      {members.length} family members
    </p>
  </div>

<div className="search-box">
  <input
    type="text"
    placeholder="Search family member..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
  />

  {searchResults.length > 0 && (
    <div className="search-results">
      {searchResults.slice(0, 8).map((member) => (
        <div
          key={member.id}
          className="search-result"
          onClick={() => {
            setSelectedMember(member);
            setSearchTerm("");
          }}
        >
          <strong>{member.name}</strong>
          <span>{member.location}</span>
        </div>
      ))}
    </div>
  )}

  {searchTerm && searchResults.length === 0 && (
    <div className="search-results">
      <div className="search-result">
        No member found
      </div>
    </div>
  )}
    <button
    className="add-member-button"
    onClick={() => setShowAddMember(true)}
  >
    + Add Member
  </button>
</div>
</header>

{showAddMember && (
  <div className="add-member-overlay">
    <form
      className="add-member-form"
      onSubmit={handleAddMember}
    >
      <h2>Add Family Member</h2>

      <input
        type="text"
        placeholder="Name *"
        value={newMember.name}
        onChange={(e) =>
          setNewMember({
            ...newMember,
            name: e.target.value,
          })
        }
        required
      />

      <input
        type="text"
        placeholder="Phone"
        value={newMember.phone}
        onChange={(e) =>
          setNewMember({
            ...newMember,
            phone: e.target.value,
          })
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={newMember.email}
        onChange={(e) =>
          setNewMember({
            ...newMember,
            email: e.target.value,
          })
        }
      />

      <input
        type="text"
        placeholder="Location"
        value={newMember.location}
        onChange={(e) =>
          setNewMember({
            ...newMember,
            location: e.target.value,
          })
        }
      />

      <select
        value={newMember.gender}
        onChange={(e) =>
          setNewMember({
            ...newMember,
            gender: e.target.value,
          })
        }
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="date"
        value={newMember.date_of_birth}
        onChange={(e) =>
          setNewMember({
            ...newMember,
            date_of_birth: e.target.value,
          })
        }
      />

      <div className="form-actions">
        <button
          type="button"
          onClick={() => setShowAddMember(false)}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={addingMember}
        >
          {addingMember
            ? "Adding..."
            : "Add Member"}
        </button>
      </div>
    </form>
  </div>
)}


      <main className="content">

        <section className="tree-container">

        <ReactFlowProvider>
          <FamilyTreeFlow
            nodes={nodes}
            edges={edges}
            selectedMember={selectedMember}
            onSelectMember={setSelectedMember}
          />
        </ReactFlowProvider>

        </section>

        {selectedMember && (
          <aside className="member-panel">

            <button
              className="close-button"
              onClick={() =>
                setSelectedMember(null)
              }
            >
              ×
            </button>

<div className="family-relations">
  <h3>Family Relations</h3>

  {relationships
    .filter(
      (relationship) =>
        relationship.member_id ===
          selectedMember.id ||
        relationship.related_member_id ===
          selectedMember.id
    )
    .map((relationship) => {
      const isMember =
        relationship.member_id ===
        selectedMember.id;

      const relatedId = isMember
        ? relationship.related_member_id
        : relationship.member_id;

      const relatedMember =
        members.find(
          (member) =>
            member.id === relatedId
        );

      if (!relatedMember) {
        return null;
      }

      return (
        <div
          key={relationship.id}
          className="relation-item"
          onClick={() =>
            setSelectedMember(
              relatedMember
            )
          }
        >
          <span>
            {relationship.relationship_type}
          </span>

          <strong>
            {relatedMember.name}
          </strong>
        </div>
      );
    })}
</div>

            <div className="member-info">

              <p>
                <strong>
                  Phone:
                </strong>{" "}
                {selectedMember.phone ||
                  "Not available"}
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {selectedMember.email ||
                  "Not available"}
              </p>

              <p>
                <strong>
                  Location:
                </strong>{" "}
                {selectedMember.location ||
                  "Not available"}
              </p>

              <p>
                <strong>
                  Gender:
                </strong>{" "}
                {selectedMember.gender ||
                  "Not available"}
              </p>

            </div>

          </aside>
        )}

      </main>

    </div>
  );
}

export default App;