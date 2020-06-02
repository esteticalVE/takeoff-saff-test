import React, { useState, useEffect } from 'react'
import { Pagination } from 'react-bootstrap'

export function PaginationComponent(props) {
  const { items = [], onChangePage, inPage = 1 } = props
  const [pager, setPager] = useState({})

  function setPage(page) {
    let itemz = items
    let pagerz = pager

    if (page < 1) {
      return
    }
    pagerz = getPager(itemz.length, page)
    const pageOfItems = itemz.slice(pagerz.startIndex, pagerz.endIndex + 1)
    setPager({ pager: pagerz })
    onChangePage(pageOfItems, page)
  }

  useEffect(() => {
    items && setPage(inPage)
  }, [items, inPage])

  function getPager(totalItems, currentPage, pageSize) {
    currentPage = currentPage || 1

    pageSize = pageSize || 10

    const totalPages = Math.ceil(totalItems / pageSize)

    let startPage, endPage

    if (totalPages <= 10) {
      startPage = 1
      endPage = totalPages
    } else {
      if (currentPage <= 6) {
        startPage = 1
        endPage = 10
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9
        endPage = totalPages
      } else {
        startPage = currentPage - 5
        endPage = currentPage + 4
      }
    }

    let startIndex = (currentPage - 1) * pageSize
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

    const pages = [...Array(endPage + 1 - startPage).keys()].map(
      item => startPage + item
    )

    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
    }
  }

  return (
    <Pagination
      style={{
        margin: 3,
      }}
    >
      {pager.pager && (
        <>
          <Pagination.First
            disabled={pager.pager.currentPage === 1}
            onClick={() => setPage(1)}
          />
          <Pagination.Prev
            disabled={pager.pager.currentPage === 1}
            onClick={() => setPage(pager.pager.currentPage - 1)}
          />

          {pager.pager.pages.map((item, index) => {
            return (
              <Pagination.Item
                key={`${item.name}/${index}`}
                active={pager.pager.currentPage === item}
                onClick={() => setPage(item)}
              >
                {item}
              </Pagination.Item>
            )
          })}
          <Pagination.Next
            disabled={pager.pager.currentPage === pager.pager.totalPages}
            onClick={() => setPage(pager.pager.currentPage + 1)}
          />
          <Pagination.Last
            disabled={pager.pager.currentPage === pager.pager.totalPages}
            onClick={() => setPage(pager.pager.totalPages)}
          />
        </>
      )}
    </Pagination>
  )
}
