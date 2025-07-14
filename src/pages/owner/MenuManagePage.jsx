import React, { useEffect, useState } from 'react';
import { ownerApi } from '../../api/ownerApi';
import MenuListView from '../../components/owner/MenuListView';
import MenuEditForm from '../../components/owner/MenuEditForm';
import BlackButton from '../../components/owner/BlackButton';
import styles from '../../assets/styles/pages/owner/MenuManagePage.module.css';

const MenuManagePage = () => {
  const [menus, setMenus] = useState([]);
  const [editMode, setEditMode] = useState(null); // null | 'create' | 'edit'
  const [editMenu, setEditMenu] = useState(null);

  // 메뉴 목록 불러오기
  const fetchMenus = async () => {
    try {
      const res = await ownerApi.getMenus();
      setMenus(res.data);
    } catch (err) {
      // 에러처리 생략
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // 메뉴 등록/수정 완료 후 목록 갱신
  const handleEditComplete = async () => {
    setEditMode(null);
    setEditMenu(null);
    await fetchMenus();
  };

  // 메뉴 등록 버튼 클릭
  const handleCreateClick = () => {
    setEditMode('create');
    setEditMenu(null);
  };

  // 메뉴 수정 버튼 클릭
  const handleEditClick = (menu) => {
    setEditMode('edit');
    setEditMenu(menu);
  };

  // 메뉴 삭제
  const handleDeleteMenu = async (menuId) => {
    await ownerApi.deleteMenu(menuId);
    await fetchMenus();
  };

  return (
    <div className={styles.menuManageContainer}>
      <h2 className={styles.pageTitle}>[ 메뉴관리 ]</h2>
      <div className={styles.menuListHeader}>
        {/* 등록모드일 때 메뉴 목록 타이틀 숨김 */}
        {editMode !== 'create' && (
          <span className={styles.menuListTitle}>메뉴 목록</span>
        )}
        {!editMode && (
          <BlackButton type="button" onClick={handleCreateClick}>등록</BlackButton>
        )}
      </div>
      {/* 메뉴 등록모드일 때는 목록 숨김, 등록폼만 출력 */}
      {editMode === 'create' ? (
        <MenuEditForm
          mode="create"
          menu={null}
          onComplete={handleEditComplete}
          onCancel={() => { setEditMode(null); setEditMenu(null); }}
        />
      ) : (
        <>
          <MenuListView
            menus={menus}
            onEdit={handleEditClick}
            onDelete={handleDeleteMenu}
            editMode={editMode}
          />
          {/* 수정모드일 때만 폼 출력 */}
          {editMode === 'edit' && (
            <MenuEditForm
              mode="edit"
              menu={editMenu}
              onComplete={handleEditComplete}
              onCancel={() => { setEditMode(null); setEditMenu(null); }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MenuManagePage;